import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLocation,
  fetchAllLocations,
  selectTotalStores,
  selectTotalWarehouses,
} from "../../store/slices/InventorySclice";
import FormSection from "../../components/FormSection/FormSection";
import type { AppDispatch } from "../../store";
import FormField from "../../components/FormField/FormField";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

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

function WarehouseIcon() {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function LocationTab({ activeTab }: { activeTab: "store" | "warehouse" }) {
  const dispatch = useDispatch<AppDispatch>();
  const stores = useSelector(selectTotalStores);
  const warehouses = useSelector(selectTotalWarehouses);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trimmedName = name.trim();
    const isDuplicate = locationsList.some(
      (loc) => loc.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      showErrorToast(`A ${label.toLowerCase()} with the name "${trimmedName}" already exists.`);
      return;
    }

    dispatch(
      createLocation({
        name: trimmedName,
        type: activeTab === "store" ? "Store" : "Warehouse",
        locationDetails: details.trim(),
      }),
    )
      .unwrap()
      .then(() => {
        setName("");
        setDetails("");
        showSuccessToast(`${label} created successfully!`);
      })
      .catch((err: any) => {
        showErrorToast(err || `Failed to create ${label.toLowerCase()}`);
      });
  };

  const locationsList = activeTab === "store" ? stores : warehouses;
  const label = activeTab === "store" ? "Store" : "Warehouse";

  return (
    <FormSection
      icon={activeTab === "store" ? <StoreIcon /> : <WarehouseIcon />}
      title={`Manage ${label}s`}
    >
      <div className="mb-6">
        <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-3">
          Current {label}s
        </h3>
        {locationsList.length === 0 ? (
          <p className="text-sm text-neutral-400 italic">No locations found.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {locationsList.map((loc) => (
              <li
                key={loc._id}
                className="border border-neutral-200 bg-neutral-50 px-4 py-3 flex justify-between items-center"
              >
                <span className="font-bold text-primary-800 uppercase tracking-wider text-sm">
                  {loc.name}
                </span>
                {loc.locationDetails && (
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">
                    {loc.locationDetails}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-5 mt-5">
        <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-4">
          Create New {label}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            id={`new-${activeTab}-name`}
            label={`${label} Name`}
            value={name}
            onChange={setName}
            placeholder="e.g. Node-Alpha"
          />
          <FormField
            id={`new-${activeTab}-details`}
            label="Location Details (Optional)"
            value={details}
            onChange={setDetails}
            placeholder="e.g. Sector 7G"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-2 w-full border border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed py-3 transition-colors cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span className="regular text-[11px] md:text-[12px] tracking-widest uppercase font-bold">
              Create {label}
            </span>
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <SaveIcon />
            </span>
          </button>
        </form>
      </div>
    </FormSection>
  );
}

export default LocationTab;
