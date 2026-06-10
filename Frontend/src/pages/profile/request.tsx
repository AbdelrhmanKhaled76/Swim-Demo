import { useState, useEffect } from "react";
import apiClient from "../../core/apiClient";
import FormSection from "../../components/FormSection/FormSection";
import type { RequestStatus } from "../../types/requestStatus";

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

function StatusBadge({ status }: { status: RequestStatus }) {
  const config: Record<RequestStatus, { label: string; classes: string }> = {
    Pending: {
      label: "Pending",
      classes: "text-amber-700 bg-amber-50 border-amber-200",
    },
    Approved: {
      label: "Approved",
      classes: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    Rejected: {
      label: "Declined",
      classes: "text-red-700 bg-red-50 border-red-200",
    },
  };
  const { label, classes } = config[status] || config.Pending;
  return (
    <span
      className={`regular text-[9px] tracking-widest uppercase font-bold border px-2 py-1 ${classes}`}
    >
      {label}
    </span>
  );
}

function RequestCard({ request }: { request: any }) {
  const isPending = request.status === "pending";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const storeName =
    typeof request.storeId === "object"
      ? request.storeId?.name
      : request.storeName;
  const itemName =
    typeof request.items[0]?.itemId === "object"
      ? request.items[0].itemId?.name
      : request.items[0]?.itemId;

  return (
    <div
      className={`border bg-white px-4 py-4 flex flex-col gap-3 transition-colors ${
        isPending ? "border-amber-200" : "border-neutral-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-primary-800 uppercase tracking-wider text-sm">
            {itemName || "Unknown Item"}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="regular text-[10px] tracking-widest text-neutral-500 uppercase">
              By {request.requestedBy?.fullName || "Me"}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="regular text-[10px] tracking-widest text-neutral-400 uppercase">
              {storeName || "Unknown Store"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status as RequestStatus} />
          <span className="regular text-[9px] tracking-widest text-neutral-400 uppercase">
            {formatDate(request.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-neutral-100 pt-3">
        <div className="flex flex-col gap-0.5">
          <span className="regular text-[9px] tracking-widest uppercase text-neutral-400 font-bold">
            Requested
          </span>
          <span className="header text-[20px] font-bold text-neutral-800 leading-none">
            {request.items[0]?.quantity ?? 0}
          </span>
        </div>
        {request.status !== "pending" && (
          <>
            <div className="text-neutral-300 text-xl">→</div>
            <div className="flex flex-col gap-0.5">
              <span
                className={`regular text-[9px] tracking-widest uppercase font-bold ${request.status === "approved" ? "text-emerald-600" : "text-red-600"}`}
              >
                {request.status === "approved" ? "Approved" : "Rejected"}
              </span>
              <span
                className={`header text-[20px] font-bold leading-none ${request.status === "approved" ? "text-emerald-700" : "text-red-700"}`}
              >
                {request.status === "approved"
                  ? (request.items[0]?.quantity ?? 0)
                  : 0}
              </span>
            </div>
          </>
        )}
        {request.notes && (
          <p className="regular text-[10px] tracking-widest text-neutral-400 italic ml-auto max-w-[200px] truncate">
            "{request.notes}"
          </p>
        )}
      </div>

      {request.adminNote && (
        <div className="border-t border-neutral-100 pt-3 flex flex-col gap-1">
          <span className="regular text-[9px] tracking-widest uppercase text-primary-600 font-bold">
            Admin Note
          </span>
          <p className="regular text-[11px] text-neutral-600 italic">
            "{request.adminNote}"
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type FilterType = "All" | RequestStatus;

export default function MyRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [filter, setFilter] = useState<FilterType>("All");

  useEffect(() => {
    const fetchMyRequests = async () => {
      setStatus("loading");
      try {
        const response = await apiClient.get<{ success: boolean; data: any }>(
          "/stock-requests/my",
        );
        let data = response.data.data;
        if (!Array.isArray(data)) {
          data = data ? [data] : [];
        }
        setRequests(data);
        setStatus("succeeded");
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    };
    fetchMyRequests();
  }, []);

  const filteredRequests =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  const counts = {
    All: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const filterOptions: FilterType[] = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
  ];

  const filterBtnClass = (f: FilterType) => {
    const base =
      "flex items-center gap-1.5 px-3 py-1.5 regular text-[10px] tracking-widest uppercase font-bold transition-colors cursor-pointer border";
    if (filter === f) {
      if (f === "Pending")
        return `${base} bg-amber-700 text-white border-amber-700`;
      if (f === "Approved")
        return `${base} bg-emerald-700 text-white border-emerald-700`;
      if (f === "Rejected")
        return `${base} bg-red-700 text-white border-red-700`;
      return `${base} bg-primary-800 text-white border-primary-800`;
    }
    return `${base} bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700`;
  };

  return (
    <div className="flex flex-col gap-5">
      <FormSection icon={<InboxIcon />} title="My Stock Requests">
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
