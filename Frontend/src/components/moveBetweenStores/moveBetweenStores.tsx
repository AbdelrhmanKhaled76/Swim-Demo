import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import transitIcon from "../../assets/icons/transit-icon.svg";
import { useSelector } from "react-redux";
import {
  selectTotalStores,
} from "../../store/slices/InventorySclice";
import { useEffect, useState } from "react";
import { type InventoryItem } from "../../interfaces/InventoryTypes/inventory";
import apiClient from "../../core/apiClient";
import { showSuccessToast } from "../../utils/toast";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

function MoveBetweenStoresPopup({ isOpen, onClose }: props) {
  if (!isOpen) return null;

  const stores = useSelector(selectTotalStores);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedSourceStoreId, setSelectedSourceStoreId] = useState("");
  const [selectedTargetStoreId, setSelectedTargetStoreId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (stores.length > 0 && !selectedSourceStoreId) {
      setSelectedSourceStoreId(stores[0]._id);
    }
  }, [stores, selectedSourceStoreId]);

  useEffect(() => {
    if (stores.length > 0 && !selectedTargetStoreId) {
      setSelectedTargetStoreId(stores[0]._id);
    }
  }, [stores, selectedTargetStoreId]);

  useEffect(() => {
    const fetchStoreInventory = async () => {
      try {
        const response = await apiClient.get<{ inventory: InventoryItem[] }>(
          `inventory/${selectedSourceStoreId}`,
        );

        setItems(response.data.inventory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStoreInventory();
  }, [isOpen, selectedSourceStoreId]);

  useEffect(() => {
    if (items.length > 0 && !selectedItemId) {
      setSelectedItemId(items[0].itemId!._id);
    }
  }, [items, selectedItemId]);

  const moveBetweenStores = async () => {
    try {
      await apiClient.post(`/inventory/${selectedTargetStoreId}/transfer`, {
        fromLocationId: selectedSourceStoreId,
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
        <div className="relative w-[380px] bg-primary-900 border border-primary-800 shadow-2xl overflow-hidden">
          {/* Watermarks */}
          <div className="absolute top-10 -right-10 text-[200px] font-bold text-primary-800/30 leading-none select-none pointer-events-none z-0 header">
            S
          </div>
          <div className="absolute top-[60%] right-6 text-[180px] font-bold text-primary-800/30 leading-none select-none pointer-events-none z-0 header">
            M
          </div>
          <div className="absolute -bottom-10 -left-10 text-[200px] font-bold text-primary-800/30 leading-none select-none pointer-events-none z-0 header">
            W
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between p-6 pb-2">
              <span className="regular text-[10px] text-primary-400 tracking-[0.2em] uppercase leading-tight">
                operation id: trns-991284
              </span>
              <button onClick={onClose} className="text-primary-300 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <h2 className="header text-3xl font-bold text-white uppercase leading-tight tracking-wide mb-8">
                move<br />between<br />stores
              </h2>

              <div className="flex flex-col gap-4">
                {/* Source Facility */}
                <div className="flex flex-col gap-2 relative">
                  <label className="regular text-[10px] text-primary-300 uppercase tracking-[0.1em]">
                    source facility
                  </label>
                  <select
                    value={selectedSourceStoreId}
                    onChange={(e) => setSelectedSourceStoreId(e.target.value)}
                    className="regular w-full bg-[#1A2332] border border-primary-700 p-3 text-white focus:outline-none appearance-none text-sm cursor-pointer uppercase transition-colors hover:border-primary-500"
                  >
                    <option value="" disabled hidden>CHOOSE SOURCE</option>
                    {stores.map((store) => (
                      <option key={store._id} value={store._id} className="uppercase bg-primary-900">
                        {store.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 bottom-3 pointer-events-none text-primary-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Target Facility */}
                <div className="flex flex-col gap-2 relative">
                  <label className="regular text-[10px] text-primary-300 uppercase tracking-[0.1em]">
                    target facility
                  </label>
                  <select
                    value={selectedTargetStoreId}
                    onChange={(e) => setSelectedTargetStoreId(e.target.value)}
                    className="regular w-full bg-[#1A2332] border border-primary-700 p-3 text-white focus:outline-none appearance-none text-sm cursor-pointer uppercase transition-colors hover:border-primary-500"
                  >
                    <option value="" disabled hidden>CHOOSE TARGET</option>
                    {stores.map((store) => (
                      <option key={store._id} value={store._id} className="uppercase bg-primary-900">
                        {store.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 bottom-3 pointer-events-none text-primary-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Item Selection */}
                <div className="flex flex-col gap-2 relative">
                  <label className="regular text-[10px] text-primary-300 uppercase tracking-[0.1em]">
                    item selection
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="regular w-full bg-[#1A2332] border border-primary-700 p-3 text-white focus:outline-none appearance-none text-sm cursor-pointer uppercase transition-colors hover:border-primary-500"
                  >
                    <option value="" disabled hidden>CHOOSE ITEM</option>
                    {items.map((item) => (
                      <option key={item.itemId!._id} value={item.itemId!._id} className="uppercase bg-primary-900">
                        {item.itemId!.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 bottom-3 pointer-events-none text-primary-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  <label className="regular text-[10px] text-primary-300 uppercase tracking-[0.1em]">
                    quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="ENTER QUANTITY"
                    className="regular w-full bg-[#1A2332] border border-primary-700 p-3 text-white placeholder-primary-700 focus:outline-none focus:border-primary-500 transition-colors text-sm uppercase"
                  />
                </div>
              </div>

              <button
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-4 mt-6 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.1em] transition-colors relative z-10"
                onClick={moveBetweenStores}
              >
                <img src={transitIcon} alt="transit" className="w-4 h-4 filter brightness-0 invert" />
                initiate transfer
              </button>
            </div>

            <div className="px-6 pb-6 mt-auto">
              <span className="regular text-[10px] text-primary-600 uppercase tracking-widest block">
                logging to system transaction ledger ...
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MoveBetweenStoresPopup;
