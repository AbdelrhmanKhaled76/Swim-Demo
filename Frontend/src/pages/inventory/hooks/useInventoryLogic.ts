import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiClient from "../../../core/apiClient";
import { useSocket } from "../../../core/useSocket";
import { type InventoryItem, type Location } from "../../../interfaces/InventoryTypes/inventory";
import {
  fetchAllLocations,
  selectTotalWarehouses,
  selectTotalStores,
  selectCurrentView,
  setCurrentView,
  selectInventoryItems,
  selectInventoryStatus,
  selectInventoryError,
  fetchInventoryForLocation
} from "../../../store/slices/InventorySclice";
import type { AppDispatch, RootState } from "../../../store";
import toast from "react-hot-toast";

const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.role || null;
  } catch (error) {
    return null;
  }
};

export const useInventoryLogic = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Activate real-time socket updates for inventory events
  useSocket();

  const token = useSelector((state: RootState) => state.auth.token);
  const userRole = getRoleFromToken(token);
  const isOwner = userRole === "Owner";

  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Sort By Quantity");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentView = useSelector(selectCurrentView);
  const totalWarehouses = useSelector(selectTotalWarehouses);
  const totalStores = useSelector(selectTotalStores);
  const inventoryItems = useSelector(selectInventoryItems);
  const inventoryStatus = useSelector(selectInventoryStatus);
  const inventoryError = useSelector(selectInventoryError);

  const [isWarehousePopupOpen, setIsWarehousePopupOpen] = useState(false);
  const [isAddNewItemPopupOpen, setIsAddNewItemPopupOpen] = useState(false);
  const [isExportToStorePopupOpen, setIsExportToStorePopupOpen] = useState(false);
  const [isImportFromWarehousePopupOpen, setIsImportFromWarehousePopupOpen] = useState(false);
  const [isMoveBetweenWarehousesPopupOpen, setIsMoveBetweenWarehousesPopupOpen] = useState(false);
  const [isMoveBetweenStoresPopupOpen, setIsMoveBetweenStoresPopupOpen] = useState(false);

  const [otherLocationsInfo, setOtherLocationsInfo] = useState<{
    matchingItems: { _id: string; name: string; category: string }[];
    otherLocations: { itemId: string; itemName: string; location: Location; quantity: number }[];
  } | null>(null);
  const [isCheckingElsewhere, setIsCheckingElsewhere] = useState(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  const activeList = currentView ? totalWarehouses : totalStores;

  const activeLocationId =
    selectedLocationId &&
    activeList.some((loc: Location) => loc._id === selectedLocationId)
      ? selectedLocationId
      : activeList[0]?._id || "";

  const selectedLocation = activeList.find(
    (loc: Location) => loc._id === activeLocationId
  );

  const changeCurrentView = () => {
    dispatch(setCurrentView(!currentView));
  };

  const handleRequestStockForItem = async (
    itemId: string,
    itemName: string,
    sourceWarehouseId: string,
    sourceWarehouseName: string
  ) => {
    const toastId = toast.loading("🤖 Agent processing transfer...");
    try {
      await apiClient.post("agent/process-request", {
        currentStoreId: activeLocationId || selectedLocation?._id || "",
        currentStoreName: selectedLocation?.name || "",
        sourceWarehouseId,
        sourceWarehouseName,
        itemId,
        itemName,
        requestedQuantity: 10,
      });
      toast.success("Stock Request Submitted Successfully!", { id: toastId });
      setSearchQuery("");
    } catch (err: any) {
      toast.error("Agent failed to process request", { id: toastId });
    }
  };

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  useEffect(() => {
    if (!isOwner && currentView) {
      dispatch(setCurrentView(false));
    }
  }, [isOwner, currentView, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".custom-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeLocationId) {
      dispatch(fetchInventoryForLocation(activeLocationId));
    }
  }, [dispatch, activeLocationId]);

  const filteredItems = inventoryItems
    .filter((item: InventoryItem) => {
      if (!item.itemId) return false;
      const q = searchQuery.toLowerCase();
      return (
        item.itemId.name.toLowerCase().includes(q) ||
        item.itemId.category.toLowerCase().includes(q) ||
        (item.itemId._id || "").toLowerCase().includes(q)
      );
    })
    .sort((a: InventoryItem, b: InventoryItem) => {
      if (sortBy === "Sort By Quantity") {
        return b.quantity - a.quantity;
      }
      if (sortBy === "Sort By Price") {
        const priceA = a.itemId?.price || 0;
        const priceB = b.itemId?.price || 0;
        return priceB - priceA;
      }
      if (sortBy === "Sort By ID") {
        const idA = a.itemId?._id || "";
        const idB = b.itemId?._id || "";
        return idA.localeCompare(idB);
      }
      if (sortBy === "Sort By Name") {
        const nameA = a.itemId?.name || "";
        const nameB = b.itemId?.name || "";
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  const totalValue = filteredItems.reduce(
    (acc: number, item: InventoryItem) => {
      const price = item.itemId?.price || 0;
      return acc + item.quantity * price;
    },
    0
  );

  useEffect(() => {
    setOtherLocationsInfo(null);
    setIsAlertDismissed(false);

    if (!searchQuery.trim()) {
      return;
    }

    if (filteredItems.length > 0) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsCheckingElsewhere(true);
      try {
        const response = await apiClient.get(
          `inventory/${activeLocationId}/check-search?q=${encodeURIComponent(searchQuery)}`
        );
        setOtherLocationsInfo(response.data);
      } catch (error) {
        console.error("Error checking item availability elsewhere:", error);
        setOtherLocationsInfo(null);
      } finally {
        setIsCheckingElsewhere(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filteredItems.length, activeLocationId]);

  return {
    userRole,
    isOwner,
    currentView,
    changeCurrentView,
    totalWarehouses,
    totalStores,
    selectedLocationId,
    setSelectedLocationId,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isDropdownOpen,
    setIsDropdownOpen,
    inventoryItems,
    inventoryStatus,
    inventoryError,
    isWarehousePopupOpen,
    setIsWarehousePopupOpen,
    isAddNewItemPopupOpen,
    setIsAddNewItemPopupOpen,
    isExportToStorePopupOpen,
    setIsExportToStorePopupOpen,
    isImportFromWarehousePopupOpen,
    setIsImportFromWarehousePopupOpen,
    isMoveBetweenWarehousesPopupOpen,
    setIsMoveBetweenWarehousesPopupOpen,
    isMoveBetweenStoresPopupOpen,
    setIsMoveBetweenStoresPopupOpen,
    otherLocationsInfo,
    isCheckingElsewhere,
    isAlertDismissed,
    setIsAlertDismissed,
    activeList,
    activeLocationId,
    selectedLocation,
    filteredItems,
    totalValue,
    handleRequestStockForItem,
  };
};
