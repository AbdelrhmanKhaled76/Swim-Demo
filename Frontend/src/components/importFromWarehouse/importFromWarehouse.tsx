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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm" onClick={onClose}>
        <div className="relative w-[90%] sm:w-[380px] max-w-[380px] bg-primary-900 border border-primary-800 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
          {/* Watermarks */}
          <div className="absolute top-10 -left-4 text-[200px] font-bold text-white/[0.03] leading-none select-none pointer-events-none z-0 header">
            S
          </div>
          <div className="absolute top-10 -right-4 text-[200px] font-bold text-white/[0.03] leading-none select-none pointer-events-none z-0 header">
            W
          </div>
          <div className="absolute bottom-10 -left-4 text-[200px] font-bold text-white/[0.03] leading-none select-none pointer-events-none z-0 header">
            I
          </div>
          <div className="absolute bottom-10 -right-4 text-[200px] font-bold text-white/[0.03] leading-none select-none pointer-events-none z-0 header">
            M
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between p-6 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-500 mt-1"></div>
                <span className="regular text-[10px] text-primary-200 tracking-[0.2em] uppercase leading-tight max-w-[140px]">
                  warehouse operation v4.2
                </span>
              </div>
              <button onClick={onClose} className="text-Accents-red hover:text-red-400 transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <h2 className="header text-3xl font-bold text-white uppercase leading-tight tracking-wide mb-6">
                import from<br />warehouse
              </h2>

              <div className="flex flex-col gap-5">
                {/* Choose Item */}
                <div className="flex flex-col gap-2 relative z-10">
                  <label className="regular text-[10px] text-primary-200 uppercase tracking-[0.1em]">
                    choose item
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="regular w-full bg-[#131C2A] border border-white/20 rounded-[4px] p-4 text-white focus:outline-none appearance-none text-sm cursor-pointer uppercase transition-colors hover:border-white/40"
                  >
                    <option value="" disabled hidden>CHOOSE ITEM</option>
                    {items.map((inventory) => (
                      <option
                        key={inventory.itemId!._id}
                        value={inventory.itemId!._id}
                        className="uppercase bg-primary-900"
                      >
                        {inventory.itemId!.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 bottom-4 pointer-events-none text-primary-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Source Warehouse */}
                <div className="flex flex-col gap-2 relative z-10">
                  <label className="regular text-[10px] text-primary-200 uppercase tracking-[0.1em]">
                    source warehouse
                  </label>
                  <select
                    value={selectedWarehouseId}
                    onChange={(e) => setSelectedWarehouseId(e.target.value)}
                    className="regular w-full bg-[#131C2A] border border-white/20 rounded-[4px] p-4 text-white focus:outline-none appearance-none text-sm cursor-pointer uppercase transition-colors hover:border-white/40"
                  >
                    <option value="" disabled hidden>CHOOSE SOURCE</option>
                    {warehouses.map((warehouse: Location) => (
                      <option key={warehouse._id} value={warehouse._id} className="uppercase bg-primary-900">
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 bottom-4 pointer-events-none text-primary-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Enter Quantity */}
                <div className="flex flex-col gap-2 relative z-10">
                  <label className="regular text-[10px] text-primary-200 uppercase tracking-[0.1em]">
                    enter quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantitiy(e.target.value)}
                      placeholder="0000"
                      className="regular w-full bg-[#131C2A] border border-white/20 rounded-[4px] p-4 text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 transition-colors text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-500 uppercase tracking-wider font-bold text-[10px]">
                      units
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-primary-800 my-6"></div>

              <div className="flex flex-col gap-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-primary-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="regular text-[10px] text-primary-300 uppercase tracking-widest leading-tight">current stock</span>
                    <span className="regular text-sm text-white font-bold leading-tight mt-1">14,202</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-primary-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="regular text-[10px] text-primary-300 uppercase tracking-widest leading-tight">transit lead</span>
                    <span className="regular text-sm text-white font-bold leading-tight mt-1">48 HOURS</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.1em] transition-colors relative z-10"
                onClick={importFromWarehouse}
              >
                execute import
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

            <div className="px-6 pb-6 mt-auto">
              <div className="flex justify-between items-end text-[10px] text-primary-600 uppercase tracking-widest regular">
                <div className="flex flex-col">
                  <span>auth:</span>
                  <span>admin_lvl_4 //</span>
                </div>
                <div className="flex flex-col text-right">
                  <span>ts: 2023-11-20</span>
                  <span>14:22:01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImportFromWarehouse;
