import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import stockIcon from "../../assets/icons/stock-icon.svg";
import transitIcon from "../../assets/icons/transit-icon.svg";
import arrowRightLong from "../../assets/icons/arrow-right-long.svg";
import { useSelector } from "react-redux";
import { selectTotalStores } from "../../store/slices/InventorySclice";
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
  warehouseId: string;
}

function ExportToStorePopup({ isOpen, onClose, warehouseId }: props) {
  if (!isOpen) return null;

  const stores = useSelector(selectTotalStores);

  const [items, setItems] = useState<InventoryItem[]>([]);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [quantity, setQuantitiy] = useState("");

  useEffect(() => {
    if (!isOpen || !warehouseId) return;
    const fetchWarehouseInventory = async () => {
      try {
        const response = await apiClient.get<{
          inventory: InventoryItem[];
        }>(`inventory/${warehouseId}`);

        setItems(response.data.inventory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWarehouseInventory();
  }, [isOpen, warehouseId]);

  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0]._id);
    }
  }, [stores, selectedStoreId]);

  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(items[0].itemId!._id);
    }
  }, [items, selectedItemId]);

  const exportToStore = async () => {
    try {
      await apiClient.post(`/inventory/${selectedStoreId}/transfer`, {
        fromLocationId: warehouseId,
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
              destination store
            </label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer"
            >
              {stores.map((store: Location) => (
                <option key={store._id} value={store._id} className="uppercase">
                  {store.name}
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
            <div className="flex items-center gap-3">
              <img src={stockIcon}></img>
              <div className="flex flex-col items-start">
                <label className="uppercase text-light-100">
                  current stock
                </label>
                <label className="uppercase text-light-100">14,202</label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={transitIcon}></img>
              <div className="flex flex-col items-start">
                <label className="uppercase text-light-100">transit lead</label>
                <label className="uppercase text-light-100">48 hours</label>
              </div>
            </div>
            <Button variant="secondary" onClick={exportToStore}>
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

export default ExportToStorePopup;
