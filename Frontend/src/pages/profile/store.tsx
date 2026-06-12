import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../core/apiClient";
import FormSection from "../../components/FormSection/FormSection";
import type { RootState } from "../../store";

// ─── Icons ───────────────────────────────────────────────────────────────────
function StoreIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default function StoreRequestForm() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [stores, setStores] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [storeId, setStoreId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let assignedLoc = (user as any)?.assignedLocation;
        
        // If not in Redux, fetch from the API
        if (!assignedLoc && user) {
          const userId = user.id || (user as any)._id;
          const userRes = await apiClient.get(`users/${userId}`);
          assignedLoc = userRes.data.data.assignedLocation;
        }
        
        // Handle if it's an object
        assignedLoc = typeof assignedLoc === 'object' && assignedLoc !== null ? assignedLoc._id : assignedLoc;

        // Fetch locations
        const locRes = await apiClient.get("/location");
        const locData = locRes.data.data || locRes.data;
        const orgStores = locData.filter(
          (l: any) => l.type === "Store" && l._id === assignedLoc
        );
        const orgWarehouses = locData.filter(
          (l: any) => l.type === "Warehouse"
        );

        setStores(orgStores);
        setWarehouses(orgWarehouses);

        if (orgStores.length > 0) {
          setStoreId(orgStores[0]._id);
        }

      } catch (err) {
        console.error("Failed to load form data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchWarehouseInventory = async () => {
      setItemId(""); // Reset selected item when warehouse changes
      if (!warehouseId) {
        setItems([]);
        return;
      }
      try {
        const invRes = await apiClient.get(`/inventory/${warehouseId}`);
        const invData =
          invRes.data.data?.inventory || invRes.data.inventory || [];
        
        // Only include items that are in stock in the warehouse
        const availableItems = invData
          .filter((inv: any) => inv.quantity > 0)
          .map((inv: any) => inv.itemId)
          .filter(Boolean);
          
        setItems(availableItems);
      } catch (err) {
        console.error("Failed to load warehouse inventory", err);
        setItems([]);
      }
    };

    fetchWarehouseInventory();
  }, [warehouseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      storeId,
      warehouseId,
      items: [
        {
          itemId,
          quantity: Number(quantity),
        },
      ],
      notes,
    };

    try {
      await apiClient.post("/stock-requests", payload);
      setMessage({
        type: "success",
        text: "Restock request sent successfully!",
      });
      setItemId("");
      setQuantity(1);
      setNotes("");
      setWarehouseId("");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <FormSection icon={<StoreIcon />} title="Create Restock Request">
        {isLoading ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="regular text-[11px] tracking-widest uppercase text-neutral-400">
              Loading form data...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Selection (Locked) */}
              <div className="flex flex-col gap-1.5">
                <label className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                  Select Store
                </label>
                <select
                  value={storeId}
                  disabled
                  className="px-3 py-2 border border-neutral-200 bg-neutral-50 text-neutral-500 outline-none transition-colors regular text-[13px] cursor-not-allowed"
                >
                  {stores.length === 0 && (
                    <option value="">-- No Assigned Store --</option>
                  )}
                  {stores.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                  Select Warehouse
                </label>
                <select
                  required
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 bg-white outline-none focus:border-primary-800 transition-colors regular text-[13px]"
                >
                  <option value="">-- Select Warehouse --</option>
                  {warehouses.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                  Select Item
                </label>
                <select
                  required
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 bg-white outline-none focus:border-primary-800 transition-colors regular text-[13px]"
                >
                  <option value="">-- Select Item --</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-3 py-2 border border-neutral-300 bg-white outline-none focus:border-primary-800 transition-colors regular text-[13px]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                Notes / Reason
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Urgent — running low on keyboards"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="px-3 py-2 border border-neutral-300 bg-white outline-none focus:border-primary-800 transition-colors regular text-[13px]"
              />
            </div>

            {/* Messages */}
            {message && (
              <div
                className={`p-3 border ${
                  message.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <span className="regular text-[12px] font-bold">
                  {message.text}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !storeId}
              className="self-end mt-2 flex items-center gap-2 px-5 py-2.5 bg-primary-800 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
              <span className="regular text-[11px] tracking-widest uppercase font-bold">
                Send Request
              </span>
            </button>
          </form>
        )}
      </FormSection>
    </div>
  );
}
