import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import arrowRightLong from "../../assets/icons/arrow-right-long.svg";
import { useSelector } from "react-redux";
import { selectTotalWarehouses } from "../../store/slices/InventorySclice";
import { useEffect, useState } from "react";
import {
  type InventoryItem,
  type Location,
} from "../../interfaces/InventoryTypes/inventory";
import apiClient from "../../core/apiClient";
import { showSuccessToast } from "../../utils/toast";

interface props {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

function ImportFromWarehouse({ isOpen, onClose, storeId }: props) {
  if (!isOpen) return null;

  const warehouses = useSelector(selectTotalWarehouses);

  const [items, setItems] = useState<InventoryItem[]>([]);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [quantity, setQuantitiy] = useState("");

  useEffect(() => {
    if (!isOpen || !selectedWarehouseId) return;
    const fetchWarehouseInventory = async () => {
      try {
        const response = await apiClient.get<{
          inventory: InventoryItem[];
        }>(`inventory/${selectedWarehouseId}`);

        setItems(response.data.inventory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWarehouseInventory();
  }, [isOpen, selectedWarehouseId]);

  useEffect(() => {
    if (warehouses.length > 0 && !selectedWarehouseId) {
      setSelectedWarehouseId(warehouses[0]._id);
    }
  }, [warehouses, selectedWarehouseId]);

  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(items[0].itemId!._id);
    }
  }, [items, selectedItemId]);

  const importFromWarehouse = async () => {
    try {
      await apiClient.post(`/inventory/${storeId}/transfer`, {
        fromLocationId: selectedWarehouseId,
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
            <span className="font-semibold uppercase">export to store</span>
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
              choose item
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
            >
              {items.map((inventory) => (
                <option
                  key={inventory.itemId!._id}
                  value={inventory.itemId!._id}
                  className="uppercase"
                >
                  {inventory.itemId!.name}
                </option>
              ))}
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              source warehouse
            </label>
            <select
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
            >
              {warehouses.map((warehouse: Location) => (
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
              enter quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantitiy(e.target.value)}
              placeholder="0"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <div className="w-full border my-1 border-light-100"></div>
            <Button variant="secondary" onClick={importFromWarehouse}>
              <div className="flex justify-center gap-5">
                execute export
                <img src={arrowRightLong}></img>
              </div>
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

export default ImportFromWarehouse;
