import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

interface OrderItemRow {
  id: string;
  itemId: string;
  quantity: number;
}

import PageTitle from "../../components/PageTitle/PageTitle";
import FormSection from "../../components/FormSection/FormSection";
import FormField from "../../components/FormField/FormField";
import QuantityStepper from "../../components/QuantityStepper/QuantityStepper";
import OrderConfirmationPopup from "../../components/orderConfirmationPopup/orderConfirmationPopup";

import {
  fetchItems,
  fetchCustomers,
  createCustomer,
  fetchStoreInventory,
  submitOrderWithPayment,
  resetOrderSubmit,
  selectItems,
  selectCustomers,
  selectItemsStatus,
  selectCustomersStatus,
  selectCreateCustomerStatus,
  selectStoreInventory,
  selectOrderSubmitStatus,
  selectLastCreatedOrder,
  selectLastTransaction,
} from "../../store/slices/orderSlice";

import { fetchAllLocations } from "../../store/slices/InventorySclice";
import { selectTotalStores } from "../../store/slices/InventorySclice";

import type { AppDispatch } from "../../store";
import type { RootState } from "../../store";

// ─── Icons ────────────────────────────────────────────────────────────────────

function UserIcon() {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BoxIcon() {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

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

function RocketIcon() {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

function Order() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const items = useSelector(selectItems);
  const customers = useSelector(selectCustomers);
  const itemsStatus = useSelector(selectItemsStatus);
  const customersStatus = useSelector(selectCustomersStatus);
  const storeInventory = useSelector(selectStoreInventory);
  const orderSubmitStatus = useSelector(selectOrderSubmitStatus);
  const lastCreatedOrder = useSelector(selectLastCreatedOrder);
  const lastTransaction = useSelector(selectLastTransaction);
  const stores = useSelector(selectTotalStores);
  const user = useSelector((state: RootState) => state.auth.user);

  // ── Local UI state ────────────────────────────────────────────────────────────
  const [orderItems, setOrderItems] = useState<OrderItemRow[]>([
    { id: Date.now().toString(), itemId: "", quantity: 1 },
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // New Customer State
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");

  const isStoreManager = user?.role === "StoreManager";
  const isCreatingCustomer = useSelector(selectCreateCustomerStatus) === "loading";

  // ── On mount: fetch data ──────────────────────────────────────────────────────
  useEffect(() => {
    if (itemsStatus === "idle") dispatch(fetchItems());
    if (customersStatus === "idle") dispatch(fetchCustomers());
    dispatch(fetchAllLocations());
  }, [dispatch, itemsStatus, customersStatus]);

  // ── Pre-select store for StoreManager ─────────────────────────────────────────
  useEffect(() => {
    if (isStoreManager && user?.assignedLocation) {
      setSelectedStoreId(user.assignedLocation);
    }
  }, [isStoreManager, user?.assignedLocation]);

  // ── Fetch inventory when store changes ────────────────────────────────────────
  useEffect(() => {
    if (selectedStoreId) {
      dispatch(fetchStoreInventory(selectedStoreId));
      // Reset items when store changes to ensure invalid items are removed
      setOrderItems([{ id: Date.now().toString(), itemId: "", quantity: 1 }]);
    } else {
      setOrderItems([{ id: Date.now().toString(), itemId: "", quantity: 1 }]);
    }
  }, [dispatch, selectedStoreId]);

  // ── Derived values ────────────────────────────────────────────────────────────
  const estimatedTotal = orderItems.reduce((sum, row) => {
    const item = items.find((i) => i._id === row.itemId);
    return sum + (item ? item.price * row.quantity : 0);
  }, 0);

  // ── Post-submit effect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (orderSubmitStatus === "succeeded" && lastCreatedOrder) {
      setIsConfirmationOpen(true);
      toast.success("Order placed and payment confirmed!");
    }
    if (orderSubmitStatus === "failed") {
      toast.error("Order failed. Please try again.");
    }
  }, [orderSubmitStatus, lastCreatedOrder]);

  // ── Submit handler ────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = orderItems.filter((row) => row.itemId);
    if (validItems.length === 0 || !selectedCustomerId || !selectedStoreId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payloadItems = validItems.map((row) => {
      const itemData = items.find((i) => i._id === row.itemId);
      return {
        itemId: row.itemId,
        quantity: row.quantity,
        unitPrice: itemData?.price || 0,
        name: itemData?.name || "",
      };
    });

    dispatch(
      submitOrderWithPayment({
        customerId: selectedCustomerId,
        storeId: selectedStoreId,
        items: payloadItems,
        notes: "",
      }),
    );
  };

  // ── Close popup and reset state ───────────────────────────────────────────────
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    dispatch(resetOrderSubmit());
    // Reset form
    setOrderItems([{ id: Date.now().toString(), itemId: "", quantity: 1 }]);
    setSelectedCustomerId("");
    if (!isStoreManager) setSelectedStoreId("");
  };

  // ── Save New Customer ─────────────────────────────────────────────────────────
  const handleSaveCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const newCustomer = await dispatch(
        createCustomer({
          name: newCustomerName,
          phone: newCustomerPhone || undefined,
          email: newCustomerEmail || undefined,
        })
      ).unwrap();

      toast.success("Customer added successfully");
      setIsAddingCustomer(false);
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewCustomerEmail("");
      setSelectedCustomerId(newCustomer._id);
    } catch (err: any) {
      toast.error(err || "Failed to create customer");
    }
  };

  // ── Dropdown options ──────────────────────────────────────────────────────────
  const itemOptions = items
    .filter((item) => storeInventory.some((inv) => inv.itemId._id === item._id && inv.quantity > 0))
    .map((item) => ({
      value: item._id,
      label: `${item.name}${item.category ? ` — ${item.category}` : ""}`,
    }));

  const customerOptions = customers.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const storeOptions = stores.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  const isLoading = orderSubmitStatus === "loading";
  const isDataLoading = itemsStatus === "loading" || customersStatus === "loading";

  // ── Confirmation popup data ───────────────────────────────────────────────────
  const selectedCustomer = customers.find((c) => c._id === selectedCustomerId);
  const orderId: string = lastCreatedOrder?._id ?? "";
  const idPrefix = orderId.slice(0, 4).toUpperCase();
  const idNum = orderId.slice(-6).toUpperCase();
  const totalAmountDollars = lastTransaction
    ? lastTransaction.amount / 100
    : estimatedTotal;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 p-section-mobile md:p-section-desktop">
      <PageTitle title="Order Management" />

      <div className="regular text-[11px] md:text-[13px] tracking-widest text-tertiary-500 uppercase mb-1 mt-1">
        System Provision
      </div>
      <div className="regular text-[9px] md:text-[10px] tracking-widest text-neutral-400 uppercase mb-8">
        Module: Order_Initialization_V4
      </div>

      {isDataLoading && (
        <div className="flex items-center gap-2 text-neutral-400 regular text-[11px] tracking-widest uppercase mb-4">
          <Spinner />
          Loading catalogue data…
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ── Customer Data ── */}
        <FormSection icon={<UserIcon />} title="Customer Data">
          {/* Customer selector — linked to backend */}
          <FormField
            id="order-customer-select"
            label="Select Customer"
            as="select"
            value={selectedCustomerId}
            onChange={setSelectedCustomerId}
            placeholder="Choose a Customer"
            options={customerOptions}
          />

          {!isAddingCustomer ? (
            <button
              type="button"
              onClick={() => setIsAddingCustomer(true)}
              className="text-left text-primary-500 regular text-[11px] font-bold tracking-widest uppercase hover:underline mt-1"
            >
              + Add new customer
            </button>
          ) : (
            <div className="border border-neutral-300 bg-neutral-50 p-4 flex flex-col gap-4 mt-2">
              <span className="header text-[14px] font-bold text-neutral-800 uppercase tracking-widest">
                New Customer Details
              </span>
              <FormField
                id="new-customer-name"
                label="Full Name *"
                value={newCustomerName}
                onChange={setNewCustomerName}
                placeholder="E.g. Jane Doe"
              />
              <FormField
                id="new-customer-phone"
                label="Phone (Optional)"
                value={newCustomerPhone}
                onChange={setNewCustomerPhone}
                placeholder="+1234567890"
              />
              <FormField
                id="new-customer-email"
                label="Email (Optional)"
                type="email"
                value={newCustomerEmail}
                onChange={setNewCustomerEmail}
                placeholder="jane@example.com"
              />
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleSaveCustomer}
                  disabled={isCreatingCustomer}
                  className="bg-primary-800 text-white px-5 py-2 uppercase regular text-[11px] tracking-widest font-bold hover:bg-primary-700 disabled:opacity-50"
                >
                  {isCreatingCustomer ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="bg-white border border-neutral-300 text-neutral-800 px-5 py-2 uppercase regular text-[11px] tracking-widest font-bold hover:bg-neutral-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </FormSection>

        {/* ── Store Selection ── */}
        <FormSection icon={<StoreIcon />} title="Store Location">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="order-store-select"
              className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
            >
              Store
            </label>
            <div className="relative w-full">
              <select
                id="order-store-select"
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                disabled={isStoreManager}
                className="regular text-[12px] md:text-[13px] tracking-widest text-neutral-800 border border-neutral-300 bg-white px-4 py-3 w-full placeholder:text-neutral-400 outline-none focus:border-primary-500 transition-colors resize-none appearance-none cursor-pointer pr-10 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  Choose a Store
                </option>
                {storeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {isStoreManager && (
              <span className="regular text-[9px] tracking-widest text-neutral-400 uppercase">
                Pre-selected based on your assigned store
              </span>
            )}
          </div>
        </FormSection>

        {/* ── Item Selection ── */}
        <FormSection icon={<BoxIcon />} title="Item Selection">
          {orderItems.map((row, index) => {
            const selectedItem = items.find((i) => i._id === row.itemId);
            const inventoryItem = storeInventory.find((inv) => inv.itemId._id === row.itemId);
            const maxQuantity = inventoryItem ? inventoryItem.quantity : 1;

            return (
              <div key={row.id} className="border border-neutral-200 bg-white p-4 flex flex-col gap-4 relative">
                {orderItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setOrderItems(prev => prev.filter(r => r.id !== row.id))}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
                    title="Remove Item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <FormField
                  id={`order-item-select-${row.id}`}
                  label={`Choose Item ${index + 1}`}
                  as="select"
                  value={row.itemId}
                  onChange={(val) => {
                    setOrderItems((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, itemId: val } : r))
                    );
                  }}
                  placeholder="Select Hardware Module"
                  options={itemOptions}
                />

                {selectedItem && (
                  <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
                    <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                      Unit Price
                    </span>
                    <span className="header text-[16px] font-bold text-primary-500">
                      ${selectedItem.price.toFixed(2)}
                    </span>
                  </div>
                )}

                <QuantityStepper
                  id={`order-quantity-${row.id}`}
                  label={row.itemId ? `Enter Quantity (Max: ${maxQuantity})` : "Enter Quantity"}
                  value={row.quantity}
                  onChange={(val) => {
                    setOrderItems((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, quantity: Math.min(val, maxQuantity) } : r))
                    );
                  }}
                  min={1}
                  max={maxQuantity}
                />
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setOrderItems(prev => [...prev, { id: Date.now().toString(), itemId: "", quantity: 1 }])}
            className="text-left text-primary-500 regular text-[11px] font-bold tracking-widest uppercase hover:underline mt-1"
          >
            + Add more item
          </button>

          <div className="border border-neutral-200 bg-neutral-50 px-5 py-4 flex flex-col gap-1 mt-4">
            <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400 font-bold">
              Estimated Total
            </span>
            <div className="flex items-end justify-between">
              <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400">
                USD
              </span>
              <span className="header text-[22px] md:text-[28px] font-bold tracking-tight text-primary-500 leading-none">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </FormSection>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-900 text-white flex items-center justify-center gap-3 py-7 transition-colors cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="header text-[16px] md:text-[20px] tracking-[0.2em] uppercase font-bold leading-tight text-center">
                Processing…
              </span>
            </>
          ) : (
            <>
              <span className="header text-[16px] md:text-[20px] tracking-[0.2em] uppercase font-bold leading-tight text-center">
                Initialize{"\n"}Order
              </span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <RocketIcon />
              </span>
            </>
          )}
        </button>
      </form>

      <OrderConfirmationPopup
        isOpen={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        idPrefix={idPrefix}
        idNum={idNum}
        customerName={selectedCustomer?.name ?? "—"}
        itemCount={orderItems.reduce((sum, row) => sum + row.quantity, 0)}
        totalAmount={totalAmountDollars}
        orderId={orderId}
        transactionId={lastTransaction?._id}
      />
    </div>
  );
}

export default Order;
