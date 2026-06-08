import { useState } from "react";
import { useSelector } from "react-redux";

import {
  selectTotalStores,
  selectTotalWarehouses,
} from "../../store/slices/InventorySclice";
import { selectPendingRequests } from "../../store/slices/requestsSlice";
import StoreManagerTab from "./StoreManagerTab";
import RequestsTab from "./RequestsTab";
import LocationTab from "./LocationTap";

type ActiveTab = "store" | "warehouse" | "storeManager" | "requests";

// ─── Main LocationManager ─────────────────────────────────────────────────────

export default function LocationManager() {
  const stores = useSelector(selectTotalStores);
  const warehouses = useSelector(selectTotalWarehouses);
  const pendingRequests = useSelector(selectPendingRequests);

  const [activeTab, setActiveTab] = useState<ActiveTab>("store");

  // ── Tab configuration ──────────────────────────────────────────────────────
  const tabs: {
    id: ActiveTab;
    label: string;
    badge?: number;
  }[] = [
    { id: "store", label: `Stores`, badge: stores.length },
    { id: "warehouse", label: `Warehouses`, badge: warehouses.length },
    { id: "storeManager", label: `Store Managers` },
    { id: "requests", label: `Requests`, badge: pendingRequests.length },
  ];

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* ── Tab Navigator ── */}
      <div className="flex border-b border-neutral-300 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasBadge = tab.badge !== undefined && tab.badge > 0;
          const isRequests = tab.id === "requests";

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-5 py-3 header text-[13px] tracking-widest uppercase font-bold transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-b-2 border-primary-800 text-primary-800"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
              {hasBadge && (
                <span
                  className={`regular text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-none ${
                    isRequests && !isActive
                      ? "bg-amber-100 text-amber-700"
                      : isActive
                        ? "bg-primary-100 text-primary-800"
                        : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {/* Pulse dot on requests if there are pending */}
              {isRequests && hasBadge && !isActive && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "store" && <LocationTab activeTab="store" />}
      {activeTab === "warehouse" && <LocationTab activeTab="warehouse" />}
      {activeTab === "storeManager" && <StoreManagerTab />}
      {activeTab === "requests" && <RequestsTab />}
    </div>
  );
}
