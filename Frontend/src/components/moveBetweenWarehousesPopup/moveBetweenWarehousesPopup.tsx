import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import transitIcon from "../../assets/icons/transit-icon.svg";
import { useSelector } from "react-redux";
import { selectTotalWarehouses } from "../../store/slices/InventorySclice";
import { useEffect, useState } from "react";
import { type InventoryItem } from "../../interfaces/InventoryTypes/inventory";
import apiClient from "../../core/apiClient";
import { showSuccessToast } from "../../utils/toast";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

function MoveBetweenWarehousesPopup({ isOpen, onClose }: props) {
  if (!isOpen) return null;

  const warehouses = useSelector(selectTotalWarehouses);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedSourceWarehouseId, setSelectedSourceWarehouseId] =
    useState("");
  const [selectedTargetWarehouseId, setSelectedTargetWarehouseId] =
    useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (warehouses.length > 0 && !selectedSourceWarehouseId) {
      setSelectedSourceWarehouseId(warehouses[0]._id);
    }
  }, [warehouses, selectedSourceWarehouseId]);

  useEffect(() => {
    if (warehouses.length > 0 && !selectedTargetWarehouseId) {
      setSelectedTargetWarehouseId(warehouses[0]._id);
    }
  }, [warehouses, selectedTargetWarehouseId]);

  useEffect(() => {
    const fetchWarehouseInventory = async () => {
      try {
        const response = await apiClient.get<{ inventory: InventoryItem[] }>(
          `inventory/${selectedSourceWarehouseId}`,
        );

        setItems(response.data.inventory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWarehouseInventory();
  }, [isOpen, selectedSourceWarehouseId]);

  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(items[0].itemId!._id);
    }
  }, [items, selectedItemId]);

  const moveBetweenWarehouses = async () => {
    try {
      await apiClient.post(`/inventory/${selectedTargetWarehouseId}/transfer`, {
        fromLocationId: selectedSourceWarehouseId,
        itemId: selectedItemId,
        quantity: Number(quantity),
      });
      showSuccessToast("item moved successfully");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-900/40">
        <div className="`w-140 bg-neutral-900 shadow-2xl rounded-t-[30px] max-h-[80vh] overflow-y-auto">
          <div className="flex h-[52px] items-center justify-between bg-light-800 px-[18px] text-[14px] tracking-[1.5px] regular text-light-100 rounded-t-[30px]">
            <span className="font-semibold uppercase">
              move between warehouses
            </span>
            <Button
              variant="outline"
              className="border-none"
              icon={cancelIcon}
              onClick={onClose}
            >
              {""}
            </Button>
          </div>
          <div className="flex flex-col gap-[18px] p-[36px]">
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              source facility
            </label>
            <select
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
              value={selectedSourceWarehouseId}
              onChange={(e) => setSelectedSourceWarehouseId(e.target.value)}
            >
              {warehouses.map((warehouse) => (
                <option
                  key={warehouse._id}
                  value={warehouse._id}
                  className="uppercase"
                >
                  {warehouse.name}
                </option>
              ))}
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              target facility
            </label>
            <select
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
              value={selectedTargetWarehouseId}
              onChange={(e) => setSelectedTargetWarehouseId(e.target.value)}
            >
              {warehouses.map((warehouse) => (
                <option
                  key={warehouse._id}
                  value={warehouse._id}
                  className="uppercase"
                >
                  {warehouse.name}
                </option>
              ))}
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              item selection
            </label>
            <select
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {items.map((item) => (
                <option
                  key={item.itemId!._id}
                  value={item.itemId!._id}
                  className="uppercase"
                >
                  {item.itemId!.name}
                </option>
              ))}
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="enter quantity"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <Button
              className="bg-secondary-500"
              icon={transitIcon}
              variant="secondary"
              onClick={moveBetweenWarehouses}
            >
              initiate transfer
            </Button>
          </div>
          <label className="regular text-tertiary-400 uppercase tracking-widest pb-5 block w-full text-center ">
            system log
          </label>
        </div>
      </div>
    </>
  );
}

export default MoveBetweenWarehousesPopup;
