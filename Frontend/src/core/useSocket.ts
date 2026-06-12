import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket";
import {
  inventoryItemAdded,
  inventoryTransferred,
  fetchInventoryForLocation,
} from "../store/slices/InventorySclice";
import { store } from "../store";
import type { AppDispatch, RootState } from "../store";
import type { InventoryItem } from "../interfaces/InventoryTypes/inventory";


export const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Read the organization ID from Redux auth state or fall back to localStorage
  const orgId = useSelector((state: RootState) => {
    if (state.auth?.user?.organizationID) return state.auth.user.organizationID;
    try {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored)?.organizationID ?? null;
    } catch {
      // ignore JSON parse errors
    }
    return null;
  });

  useEffect(() => {
    if (!orgId) return;

    // ── Connect & join org room ─────────────────────────────────────────────
    socket.connect();

    const handleConnect = () => {
      socket.emit("join_org", orgId);
    };

    // If already connected (e.g. hot-reload), join immediately
    if (socket.connected) {
      socket.emit("join_org", orgId);
    } else {
      socket.on("connect", handleConnect);
    }

    // ── Listener: new item added to a location ──────────────────────────────
    const handleItemAdded = (payload: {
      locationId: string;
      organizationId: string;
      item: InventoryItem;
    }) => {
      dispatch(
        inventoryItemAdded({
          locationId: payload.locationId,
          item: payload.item,
        })
      );
    };

    // ── Listener: stock transferred between two locations ───────────────────
    const handleTransferred = (payload: {
      organizationId: string;
      fromLocationId: string;
      toLocationId: string;
      itemId: string;
      fromQuantity: number;
      toQuantity: number;
    }) => {
      // Optimistic update for items already in the current view
      dispatch(
        inventoryTransferred({
          fromLocationId: payload.fromLocationId,
          toLocationId: payload.toLocationId,
          itemId: payload.itemId,
          fromQuantity: payload.fromQuantity,
          toQuantity: payload.toQuantity,
        })
      );

      const state = store.getState();
      const activeLocationId = state.inventory.activeLocationId;

      if (payload.toLocationId === activeLocationId) {
        const items = state.inventory.inventoryItems;
        const itemAlreadyInView = items.some(
          (inv) =>
            inv.itemId?._id === payload.itemId ||
            (inv.itemId as unknown as string) === payload.itemId
        );

        if (!itemAlreadyInView) {
          // New item arriving — re-fetch the location's inventory to get full details
          dispatch(fetchInventoryForLocation(activeLocationId));
        }
      }
    };

    socket.on("inventory_item_added", handleItemAdded);
    socket.on("inventory_transferred", handleTransferred);

    // ── Cleanup on unmount ──────────────────────────────────────────────────
    return () => {
      socket.off("connect", handleConnect);
      socket.off("inventory_item_added", handleItemAdded);
      socket.off("inventory_transferred", handleTransferred);
      socket.disconnect();
    };
  }, [orgId, dispatch]);
};
