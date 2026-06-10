import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import ReceiptLineItem, {
  type ReceiptLineItemData,
} from "../../components/ReceiptLineItem/ReceiptLineItem";
import apiClient from "../../core/apiClient";

// ─── Icons ─────────────────────────────────────────────────────────────────

function ExportIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function GenerateIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PrinterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="32"
      height="32"
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

// ─── Types ──────────────────────────────────────────────────────────────────

interface PopulatedItem {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface OrderItem {
  itemId: PopulatedItem | null;
  quantity: number;
  _id: string;
}

interface PopulatedCustomer {
  _id: string;
  name: string;
}

interface PopulatedStore {
  _id: string;
  name: string;
}

interface FetchedOrder {
  _id: string;
  customerId: PopulatedCustomer | null;
  storeId: PopulatedStore | null;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
}

interface FetchedTransaction {
  _id: string;
  amount: number; // in cents
  currency: string;
  status: string;
  stripePaymentIntentId: string;
  createdAt: string;
}

// ─── QR Code SVG (static decorative) ───────────────────────────────────────

function QrCode() {
  return (
    <svg width="50" height="50" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="2" stroke="#0C3E75" strokeWidth="2" />
      <rect x="7" y="7" width="10" height="10" rx="1" fill="#0C3E75" />
      <rect x="29" y="1" width="22" height="22" rx="2" stroke="#0C3E75" strokeWidth="2" />
      <rect x="35" y="7" width="10" height="10" rx="1" fill="#0C3E75" />
      <rect x="1" y="29" width="22" height="22" rx="2" stroke="#0C3E75" strokeWidth="2" />
      <rect x="7" y="35" width="10" height="10" rx="1" fill="#0C3E75" />
      <rect x="29" y="29" width="4" height="4" fill="#0C3E75" />
      <rect x="35" y="29" width="4" height="4" fill="#0C3E75" />
      <rect x="41" y="29" width="4" height="4" fill="#0C3E75" />
      <rect x="47" y="29" width="4" height="4" fill="#0C3E75" />
      <rect x="29" y="35" width="4" height="4" fill="#0C3E75" />
      <rect x="41" y="35" width="4" height="4" fill="#0C3E75" />
      <rect x="35" y="41" width="4" height="4" fill="#0C3E75" />
      <rect x="41" y="41" width="4" height="4" fill="#0C3E75" />
      <rect x="47" y="41" width="4" height="4" fill="#0C3E75" />
      <rect x="29" y="47" width="4" height="4" fill="#0C3E75" />
      <rect x="41" y="47" width="4" height="4" fill="#0C3E75" />
    </svg>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

function Reciept() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");

  const [order, setOrder] = useState<FetchedOrder | null>(null);
  const [transaction, setTransaction] = useState<FetchedTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printed, setPrinted] = useState(false);

  // ── Fetch order + transaction on mount if IDs are present ──────────────────
  useEffect(() => {
    if (!orderId && !transactionId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [orderRes, txRes] = await Promise.all([
          orderId ? apiClient.get(`order/${orderId}`) : Promise.resolve(null),
          transactionId ? apiClient.get(`transactions/${transactionId}`) : Promise.resolve(null),
        ]);
        if (orderRes) setOrder(orderRes.data.data);
        if (txRes) setTransaction(txRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load receipt data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, transactionId]);

  const handlePrint = () => {
    setPrinted(true);
    window.print();
    setTimeout(() => setPrinted(false), 2000);
  };

  // ── Derived display values ─────────────────────────────────────────────────
  const isLive = !!(orderId || transactionId);
  const ledgerId = order ? `ORDER-${order._id.slice(-8).toUpperCase()}` : "LEDGER_7729-01";
  const transId = transaction ? transaction.stripePaymentIntentId : "882931-XA";
  const timestamp = order ? formatDate(order.createdAt) : "2023-10-24 14:22:09 UTC";
  const storeName = order?.storeId?.name ?? "W-DIST-CENTRAL-04";
  const customerName = order?.customerId?.name ?? "—";

  // Build line items from real order items, or fall back to static demo data
  const lineItems: ReceiptLineItemData[] = isLive && order
    ? order.items.map((oi, idx) => ({
        itemNo: String(idx + 1).padStart(3, "0"),
        skuIdentifier: oi.itemId?._id?.slice(-8).toUpperCase() ?? `ITEM-${idx + 1}`,
        description: oi.itemId?.name ?? "Unknown Item",
        qty: oi.quantity,
        unitVal: oi.itemId?.price ?? 0,
      }))
    : [
        { itemNo: "001", skuIdentifier: "SKU-BRD-490", description: "Industrial Circuit Interface – Type C", qty: 12, unitVal: 450 },
        { itemNo: "002", skuIdentifier: "SKU-CON-221", description: "Reinforced Coupling (Steel Alloy)", qty: 45, unitVal: 22.5 },
        { itemNo: "003", skuIdentifier: "SKU-CAB-004", description: "High-Tensile Optic Cable (50m)", qty: 5, unitVal: 1200 },
        { itemNo: "004", skuIdentifier: "SKU-LUB-890", description: "Synthetic Lubricant (Grade A)", qty: 10, unitVal: 120 },
      ];

  // Total: use transaction amount (cents ÷ 100) if available, else order totalPrice
  const totalAmount = transaction
    ? transaction.amount / 100
    : order
    ? order.totalPrice
    : 14066.69;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 p-section-mobile md:p-section-desktop">
      <PageTitle title="Reciept Generation" />

      <div className="mt-1 mb-1">
        <span className="regular text-[9px] md:text-[10px] tracking-widest text-tertiary-500 uppercase">
          Digital Ledger / Transaction Ledger
        </span>
      </div>
      <div className="mb-5">
        <span className="header text-[16px] md:text-[20px] font-bold tracking-widest text-neutral-900 uppercase">
          {ledgerId}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-8">
        <button
          id="btn-export-csv"
          className="regular text-[9px] md:text-[10px] tracking-widest uppercase flex items-center gap-2 px-4 py-2.5 border border-neutral-400 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <ExportIcon />
          Export{"\n"}CSV
        </button>

        <button
          id="btn-generate-pdf"
          onClick={handlePrint}
          disabled={loading}
          className="regular text-[9px] md:text-[10px] tracking-widest uppercase flex items-center gap-2 px-4 py-2.5 bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GenerateIcon />
          {printed ? "Generating…" : "Generate\nPDF"}
        </button>
      </div>

      {/* ── Loading / Error states ── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-neutral-400">
          <Spinner />
          <span className="regular text-[11px] tracking-widest uppercase">Loading receipt data…</span>
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 px-5 py-4 mb-6 text-red-600 regular text-[11px] tracking-widest uppercase">
          {error}
        </div>
      )}

      {!loading && (
        <div className="border border-neutral-300 bg-white mb-6">
          {/* ── Header ── */}
          <div className="px-5 pt-5 pb-5">
            <span className="header text-[18px] md:text-[22px] font-bold tracking-widest uppercase text-neutral-900 block">
              Swim Corp.
            </span>
            <span className="regular text-[8px] md:text-[9px] tracking-widest uppercase text-neutral-400 block mt-1">
              Industrial Logistics Division
            </span>
            <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-700 font-bold block mt-0.5">
              TRANS_ID: {transId}
            </span>

            <div className="flex flex-col items-start gap-1 mt-4">
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold text-center">
                Timestamp
              </span>
              <span className="header text-[13px] md:text-[15px] font-bold tracking-wide text-neutral-900 text-center">
                {timestamp}
              </span>
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold text-center mt-1">
                Location
              </span>
              <span className="header text-[13px] md:text-[15px] font-bold tracking-wide text-neutral-900 uppercase text-center">
                {storeName}
              </span>
            </div>
          </div>

          <hr className="border-neutral-300 border-1 w-[95%] mx-auto" />

          {/* ── Party Details ── */}
          <div className="flex flex-col gap-3 p-4">
            <div className="bg-neutral-100/30 rounded-sm px-4 py-4">
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold block mb-2">
                Customer
              </span>
              <span className="header text-[13px] md:text-[14px] font-bold tracking-wide text-neutral-900 block">
                {customerName}
              </span>
            </div>

            <div className="bg-neutral-100/30 rounded-sm px-4 py-4">
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold block mb-2">
                Store / Location
              </span>
              <span className="header text-[13px] md:text-[14px] font-bold tracking-wide text-neutral-900 block">
                {storeName}
              </span>
            </div>

            {order?.status && (
              <div className="bg-neutral-100/30 rounded-sm px-4 py-4">
                <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold block mb-2">
                  Order Status
                </span>
                <span className="header text-[13px] md:text-[14px] font-bold tracking-wide text-neutral-900 uppercase block">
                  {order.status}
                </span>
              </div>
            )}
          </div>

          {/* ── Line Items Table ── */}
          <div className="mx-4">
            <div className="grid grid-cols-[60px_110px_1fr_60px_110px] md:grid-cols-[80px_140px_1fr_80px_130px] px-4 py-3 bg-primary-800">
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-white font-bold text-right pr-3">
                Item #
              </span>
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-white font-bold text-left pl-2">
                SKU Identifier
              </span>
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-white font-bold text-left">
                Description
              </span>
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-white font-bold text-left pl-1">
                QTY
              </span>
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-white font-bold text-left pl-1">
                Unit Val
              </span>
            </div>

            <div className="bg-white">
              {lineItems.map((item, index) => (
                <ReceiptLineItem
                  key={item.itemNo}
                  item={item}
                  isLast={index === lineItems.length - 1}
                />
              ))}
            </div>
          </div>

          {order?.notes && (
            <div className="flex items-start gap-2 px-5 py-3">
              <span className="block w-[8px] h-[8px] mt-[2px] bg-secondary-500 shrink-0" />
              <span className="regular text-[8px] md:text-[9px] tracking-widest uppercase text-neutral-700 font-bold leading-snug">
                Note: {order.notes}
              </span>
            </div>
          )}

          {!order?.notes && (
            <div className="flex items-start gap-2 px-5 py-3">
              <span className="block w-[8px] h-[8px] mt-[2px] bg-secondary-500 shrink-0" />
              <span className="regular text-[8px] md:text-[9px] tracking-widest uppercase text-neutral-700 font-bold leading-snug">
                Priority Shipment: Manual Verification Required
              </span>
            </div>
          )}

          {/* ── Internal Memo ── */}
          <div className="relative border border-neutral-300 mx-4 mb-0 overflow-hidden">
            <div className="px-4 py-4">
              <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 font-bold block mb-2">
                Internal Memo
              </span>
              <p className="regular text-[10px] md:text-[11px] tracking-wide text-neutral-700 leading-relaxed">
                {order?.notes ||
                  "Shipment includes hazardous materials. Ensure all Type-C protocols are strictly followed at Destination Outlet 42. Verify temperature logs upon arrival."}
              </p>
            </div>
            <div className="absolute bottom-3 right-4 opacity-10 pointer-events-none select-none">
              <QrCode />
            </div>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-neutral-200 mt-0">
            <span className="regular text-[8px] md:text-[9px] tracking-widest uppercase text-neutral-500">
              Subtotal
            </span>
            <span className="regular text-[9px] md:text-[10px] tracking-widest text-neutral-800 font-bold">
              ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center bg-primary-800 px-5 py-4 mx-4 mb-4">
            <span className="regular text-[9px] md:text-[11px] tracking-widest uppercase text-white font-bold">
              Total Ledger Val
            </span>
            <span className="header text-[22px] md:text-[28px] font-bold tracking-tight text-white leading-none">
              ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border-t border-dashed border-neutral-300 mx-0" />

          {/* ── Auth Footer ── */}
          <div className="flex flex-col items-center gap-2 px-5 py-6">
            <QrCode />
            <span className="regular text-[8px] md:text-[9px] tracking-widest uppercase text-neutral-800 font-bold text-center">
              Auth Code: {transaction?.stripePaymentIntentId?.slice(-10).toUpperCase() ?? "ZX-99-ALPHA"}
            </span>
            <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-500 text-center">
              Validated by Swim Central Ledger Engine v4.2.0
            </span>
            <span className="regular text-[7px] md:text-[8px] tracking-widest uppercase text-neutral-400 text-center leading-relaxed max-w-xs">
              This is a legally binding digital record. Physical copies must
              retain the authentication hash for audit compliance.
            </span>
          </div>
        </div>
      )}

      <button
        id="btn-print-receipt"
        onClick={handlePrint}
        disabled={loading}
        className="w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-900 text-white flex items-center justify-center gap-3 py-6 transition-colors cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="header text-[16px] md:text-[18px] tracking-[0.3em] uppercase font-bold">
          {printed ? "Sending…" : "Print"}
        </span>
        <span className="group-hover:translate-y-0.5 transition-transform">
          <PrinterIcon />
        </span>
      </button>
    </div>
  );
}

export default Reciept;
