import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import {
  fetchRequests,
  declineRequest,
  approveRequest,
  selectAllRequests,
  selectRequestsStatus,
} from "../../store/slices/requestsSlice";
import type { StockRequest } from "../../interfaces/RequestTypes/request";
import FormSection from "../../components/FormSection/FormSection";

// ─── Icons ───────────────────────────────────────────────────────────────────

function InboxIcon() {
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
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type RequestStatus = "pending" | "approved" | "rejected";

function StatusBadge({ status }: { status: RequestStatus }) {
  const config: Record<RequestStatus, { label: string; classes: string }> = {
    pending: {
      label: "Pending",
      classes: "text-amber-700 bg-amber-50 border-amber-200",
    },
    approved: {
      label: "Approved",
      classes: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    rejected: {
      label: "Declined",
      classes: "text-red-700 bg-red-50 border-red-200",
    },
  };
  const { label, classes } = config[status];
  return (
    <span
      className={`regular text-[9px] tracking-widest uppercase font-bold border px-2 py-1 ${classes}`}
    >
      {label}
    </span>
  );
}

// ─── Inline Edit Approve Row ──────────────────────────────────────────────────

function EditApproveRow({
  request,
  onConfirm,
  onCancel,
  isLoading,
}: {
  request: StockRequest;
  onConfirm: (qty: number) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [qty, setQty] = useState<number>(request.items[0]?.quantity ?? 1);

  return (
    <div className="mt-3 border border-primary-200 bg-primary-50 px-4 py-3 flex flex-col gap-3">
      <p className="regular text-[10px] tracking-widest uppercase text-primary-700 font-bold">
        Edit quantity before approving
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-neutral-300 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-neutral-500 hover:text-primary-800 hover:bg-neutral-50 transition-colors font-bold text-lg leading-none cursor-pointer"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="regular text-[13px] tracking-widest text-neutral-800 bg-transparent px-3 py-2 w-24 text-center outline-none border-x border-neutral-200"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-neutral-500 hover:text-primary-800 hover:bg-neutral-50 transition-colors font-bold text-lg leading-none cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="regular text-[10px] text-neutral-400 tracking-widest uppercase">
          (requested: {request.items[0]?.quantity ?? 0})
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onConfirm(qty)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary-800 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckIcon />
          )}
          <span className="regular text-[10px] tracking-widest uppercase font-bold">
            Confirm & Approve
          </span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <span className="regular text-[10px] tracking-widest uppercase font-bold">
            Cancel
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({ request }: { request: StockRequest }) {
  const dispatch = useDispatch<AppDispatch>();
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<
    "approve" | "decline" | "editApprove" | null
  >(null);

  const isPending = request.status === "pending";

  const handleApprove = async () => {
    setActionLoading("approve");
    try {
      await dispatch(approveRequest({ id: request._id })).unwrap();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async () => {
    setActionLoading("decline");
    try {
      await dispatch(declineRequest(request._id)).unwrap();
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditApprove = async (qty: number) => {
    setActionLoading("editApprove");
    try {
      await dispatch(
        approveRequest({ id: request._id, approvedQuantity: qty }),
      ).unwrap();
      setEditMode(false);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`border bg-white px-4 py-4 flex flex-col gap-3 transition-colors ${
        isPending ? "border-amber-200" : "border-neutral-200"
      }`}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-primary-800 uppercase tracking-wider text-sm">
            {request.items[0]?.itemId || "Unknown Item"}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="regular text-[10px] tracking-widest text-neutral-500 uppercase">
              By {request.requestedBy.fullName || "Unknown"}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="regular text-[10px] tracking-widest text-neutral-400 uppercase">
              {request.storeName || "Unknown Store"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <span className="regular text-[9px] tracking-widest text-neutral-400 uppercase">
            {formatDate(request.resolvedAt)}
          </span>
        </div>
      </div>

      {/* Quantity info */}
      <div className="flex items-center gap-4 border-t border-neutral-100 pt-3">
        <div className="flex flex-col gap-0.5">
          <span className="regular text-[9px] tracking-widest uppercase text-neutral-400 font-bold">
            Requested
          </span>
          <span className="header text-[20px] font-bold text-neutral-800 leading-none">
            {request.items[0]?.quantity ?? 0}
          </span>
        </div>
        {request !== undefined && (
          <>
            <div className="text-neutral-300 text-xl">→</div>
            <div className="flex flex-col gap-0.5">
              <span className="regular text-[9px] tracking-widest uppercase text-emerald-600 font-bold">
                Approved
              </span>
              <span className="header text-[20px] font-bold text-emerald-700 leading-none">
                {request.items[0]?.quantity ?? 0}
              </span>
            </div>
          </>
        )}
        {request.notes && (
          <p className="regular text-[10px] tracking-widest text-neutral-400 italic ml-auto">
            {request.notes}
          </p>
        )}
      </div>

      {/* Action buttons — only for Pending */}
      {isPending && !editMode && (
        <div className="flex gap-2 flex-wrap border-t border-neutral-100 pt-3">
          {/* Approve */}
          <button
            type="button"
            disabled={actionLoading !== null}
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-600 active:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {actionLoading === "approve" ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckIcon />
            )}
            <span className="regular text-[10px] tracking-widest uppercase font-bold">
              Approve
            </span>
          </button>

          {/* Edit & Approve */}
          <button
            type="button"
            disabled={actionLoading !== null}
            onClick={() => setEditMode(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <EditIcon />
            <span className="regular text-[10px] tracking-widest uppercase font-bold">
              Edit & Approve
            </span>
          </button>

          {/* Decline */}
          <button
            type="button"
            disabled={actionLoading !== null}
            onClick={handleDecline}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {actionLoading === "decline" ? (
              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <XIcon />
            )}
            <span className="regular text-[10px] tracking-widest uppercase font-bold">
              Decline
            </span>
          </button>
        </div>
      )}

      {/* Inline edit panel */}
      {isPending && editMode && (
        <EditApproveRow
          request={request}
          onConfirm={handleEditApprove}
          onCancel={() => setEditMode(false)}
          isLoading={actionLoading === "editApprove"}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FilterType = "All" | RequestStatus;

export default function RequestsTab() {
  const dispatch = useDispatch<AppDispatch>();
  const allRequests = useSelector(selectAllRequests);
  const status = useSelector(selectRequestsStatus);

  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRequests());
    }
  }, [dispatch, status]);

  const filteredRequests =
    filter === "All"
      ? allRequests
      : allRequests.filter((r) => r.status === filter);

  const counts = {
    All: allRequests.length,
    pending: allRequests.filter((r) => r.status === "pending").length,
    approved: allRequests.filter((r) => r.status === "approved").length,
    rejected: allRequests.filter((r) => r.status === "rejected").length,
  };

  const filterOptions: FilterType[] = [
    "All",
    "pending",
    "approved",
    "rejected",
  ];

  const filterBtnClass = (f: FilterType) => {
    const base =
      "flex items-center gap-1.5 px-3 py-1.5 regular text-[10px] tracking-widest uppercase font-bold transition-colors cursor-pointer border";
    if (filter === f) {
      if (f === "pending")
        return `${base} bg-amber-700 text-white border-amber-700`;
      if (f === "approved")
        return `${base} bg-emerald-700 text-white border-emerald-700`;
      if (f === "rejected")
        return `${base} bg-red-700 text-white border-red-700`;
      return `${base} bg-primary-800 text-white border-primary-800`;
    }
    return `${base} bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700`;
  };

  return (
    <div className="flex flex-col gap-5">
      <FormSection icon={<InboxIcon />} title="Stock Requests">
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-1 text-neutral-400">
            <FilterIcon />
            <span className="regular text-[9px] tracking-widest uppercase font-bold">
              Filter:
            </span>
          </div>
          {filterOptions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={filterBtnClass(f)}
            >
              {f}
              <span className="ml-1 text-[9px] opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Pending notice */}
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-2.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="regular text-[10px] tracking-widest uppercase text-amber-700 font-bold">
              {counts.pending} request{counts.pending > 1 ? "s" : ""} awaiting
              your decision
            </span>
          </div>
        )}

        {/* Content */}
        {status === "loading" ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="regular text-[11px] tracking-widest uppercase text-neutral-400">
              Loading requests...
            </span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-300"
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <p className="regular text-[11px] tracking-widest uppercase text-neutral-400">
              No {filter !== "All" ? filter.toLowerCase() + " " : ""}requests
              found.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filteredRequests.map((req) => (
              <li key={req._id}>
                <RequestCard request={req} />
              </li>
            ))}
          </ul>
        )}
      </FormSection>
    </div>
  );
}
