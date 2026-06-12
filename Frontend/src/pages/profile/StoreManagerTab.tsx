import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import {
  fetchStoreManagers,
  createStoreManager,
  selectStoreManagers,
  selectStoreManagerStatus,
} from "../../store/slices/storeManagerSlice";
import { selectTotalStores } from "../../store/slices/InventorySclice";
import FormField from "../../components/FormField/FormField";
import FormSection from "../../components/FormSection/FormSection";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

function UserPlusIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
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
export default function StoreManagerTab() {
  const dispatch = useDispatch<AppDispatch>();
  const managers = useSelector(selectStoreManagers);
  const status = useSelector(selectStoreManagerStatus);
  const stores = useSelector(selectTotalStores);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStoreManagers());
    }
  }, [dispatch, status]);

  // Find store IDs that already have a manager assigned
  const assignedStoreIds = managers.map((mgr) =>
    typeof mgr.assignedLocation === "object"
      ? mgr.assignedLocation?._id
      : mgr.assignedLocation
  );

  const availableStores = stores.filter(
    (s) => !assignedStoreIds.includes(s._id) && !s.name.toLowerCase().includes("downtown")
  );

  const storeOptions = availableStores.map((s) => ({ value: s._id, label: s.name }));

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim() || !storeId)
      return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createStoreManager({
          fullName,
          email,
          password,
          assignedLocation: storeId,
          role: "StoreManager",
        }),
      ).unwrap();
      setFullName("");
      setEmail("");
      setPassword("");
      setStoreId("");
      showSuccessToast("Store manager is created successfully");
    } catch (err) {
      showErrorToast(`Failed to create a store manager due to ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    fullName.trim() && email.trim() && password.trim() && storeId;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Manager List ── */}
      <FormSection icon={<UserPlusIcon />} title="Store Managers">
        <div className="mb-6">
          <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-3">
            Current Managers
          </h3>

          {status === "loading" ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <span className="regular text-[11px] tracking-widest uppercase text-neutral-400">
                Loading...
              </span>
            </div>
          ) : managers.length === 0 ? (
            <p className="regular text-[12px] text-neutral-400 italic py-2">
              No store managers assigned yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {managers.map((mgr) => (
                <li
                  key={mgr._id}
                  className="border border-neutral-200 bg-neutral-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-primary-800 uppercase tracking-wider text-sm">
                      {mgr.fullName}
                    </span>
                    <span className="regular text-[11px] tracking-widest text-neutral-500 uppercase">
                      {mgr.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Store badge */}
                    <div className="flex items-center gap-1.5 border border-primary-200 bg-primary-50 px-3 py-1">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-700"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="regular text-[10px] tracking-widest uppercase text-primary-700 font-bold">
                        {mgr.storeName ||
                          (typeof mgr.assignedLocation === "object"
                            ? mgr.assignedLocation?.name
                            : stores.find((s) => s._id === mgr.assignedLocation)
                                ?.name) ||
                          "Unknown Store"}
                      </span>
                    </div>
                    {/* Role badge */}
                    <span className="regular text-[9px] tracking-widest uppercase text-emerald-700 font-bold border border-emerald-200 bg-emerald-50 px-2 py-1">
                      Manager
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Create Form ── */}
        <div className="border-t border-neutral-200 pt-5 mt-5">
          <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-4">
            Assign New Store Manager
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="new-manager-name"
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="e.g. John Doe"
            />
            <FormField
              id="new-manager-email"
              label="Authentication Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="e.g. j.doe@swim-hq.io"
            />
            <FormField
              id="new-manager-password"
              label="Initial Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Minimum 8 characters"
            />

            {/* Store selector */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-manager-store"
                className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
              >
                Assigned Store
              </label>
              <select
                id="new-manager-store"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                className="regular text-[12px] md:text-[13px] tracking-widest text-neutral-800 border-l-2 border-l-primary-500 border border-neutral-300 bg-white px-4 py-3 w-full outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">— Select a store —</option>
                {storeOptions.length === 0 ? (
                  <option disabled>No stores available</option>
                ) : (
                  storeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
              {stores.length === 0 && (
                <p className="regular text-[10px] tracking-widest text-amber-600 uppercase">
                  ⚠ Create a store first before assigning a manager.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="mt-2 w-full border border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed py-3 transition-colors cursor-pointer flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="regular text-[11px] md:text-[12px] tracking-widest uppercase font-bold">
                    Assign Manager
                  </span>
                  <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <SaveIcon />
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </FormSection>
    </div>
  );
}
