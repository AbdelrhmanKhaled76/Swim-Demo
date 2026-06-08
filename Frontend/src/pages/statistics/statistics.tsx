import { useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PerformanceMetric {
  label: string;
  value: string;
  unit?: string;
}

interface DockActivity {
  id: string;
  company: string;
  status: "ONLOADING" | "STAGING" | "CLEARED";
  day: string;
}

interface AlertItem {
  type: "warning" | "info";
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REAL_TIME_METRICS: PerformanceMetric[] = [
  { label: "LATENCY", value: "14ms" },
  { label: "THROUGHPUT", value: "8.2k/hr" },
  { label: "ERROR RATE", value: "0.02%" },
  { label: "UPTIME", value: "99.99%" },
];

const HISTORY_METRICS: PerformanceMetric[] = [
  { label: "LATENCY", value: "18ms" },
  { label: "THROUGHPUT", value: "7.6k/hr" },
  { label: "ERROR RATE", value: "0.08%" },
  { label: "UPTIME", value: "99.91%" },
];

const DOCK_ACTIVITIES: DockActivity[] = [
  {
    id: "IN-7492",
    company: "Logistics Corp",
    status: "ONLOADING",
    day: "DAY 4: ONLOADING",
  },
  {
    id: "OUT-218",
    company: "Regional Dist",
    status: "STAGING",
    day: "DAY 2: STAGING",
  },
  {
    id: "IN-8851",
    company: "Global Freight",
    status: "CLEARED",
    day: "DAY 7: CLEARED",
  },
];

const ALERTS: AlertItem[] = [
  { type: "warning", message: "LOW STOCK: SKU-882 (HUB-B4)" },
  { type: "info", message: "MANIFEST 7729 AUTO-UPDATED" },
];

// Stock velocity bar chart data (relative heights 0-100)
const VELOCITY_BARS = [
  { time: "08:00", height: 45 },
  { time: "", height: 70 },
  { time: "", height: 30 },
  { time: "", height: 55 },
  { time: "12:00", height: 85 },
  { time: "", height: 40 },
  { time: "", height: 60 },
  { time: "", height: 25 },
  { time: "14:00", height: 72 },
  { time: "", height: 50 },
  { time: "", height: 38 },
  { time: "16:00", height: 90 },
];

// Logistics performance bar chart data
const LOGISTICS_BARS = [
  { height: 40 },
  { height: 55 },
  { height: 35 },
  { height: 70 },
  { height: 50 },
  { height: 80 },
  { height: 45 },
  { height: 65 },
  { height: 30 },
  { height: 75 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DockActivity["status"] }) {
  const config = {
    ONLOADING: "bg-[#0C3E75] text-white",
    STAGING: "bg-[#343C48] text-white",
    CLEARED: "bg-[#344248] text-[#4ECDC4]",
  };
  return (
    <span
      className={`regular text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold ${config[status]}`}
    >
      {status}
    </span>
  );
}

function BarChart({
  bars,
  showTimeLabels = false,
  height = 80,
}: {
  bars: { height: number; time?: string }[];
  showTimeLabels?: boolean;
  height?: number;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="flex items-end gap-[3px] w-full"
        style={{ height: `${height}px` }}
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            className="flex-1 bg-[#2B2B2C] hover:bg-[#0C3E75] transition-colors duration-300 cursor-pointer"
            style={{ height: `${bar.height}%` }}
          />
        ))}
      </div>
      {showTimeLabels && (
        <div className="flex justify-between">
          {bars.map((bar, i) =>
            bar.time ? (
              <span
                key={i}
                className="regular text-[9px] text-neutral-400 tracking-widest"
              >
                {bar.time}
              </span>
            ) : (
              <span key={i} className="flex-1" />
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function Statistics() {
  const [activeTab, setActiveTab] = useState<"realtime" | "history">(
    "realtime",
  );
  const metrics =
    activeTab === "realtime" ? REAL_TIME_METRICS : HISTORY_METRICS;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 p-section-mobile md:p-section-desktop">
      {/* ── Page Title ── */}
      <PageTitle title="Warehouse Analytics Overview" />
      <p className="regular text-[12px] md:text-[13px] tracking-widest text-tertiary-400 uppercase mb-8 mt-1">
        Real-time telemetry and capacity metrics.
      </p>

      {/* ── Total Stock Value Banner ── */}
      <div className="bg-[#1A1A1B] border border-neutral-800 px-8 py-6 mb-6 flex flex-col items-center justify-center text-center">
        <span className="regular text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-2">
          TOTAL STOCK VALUE
        </span>
        <span className="header text-[48px] md:text-[56px] font-bold text-[#FFE6B3] tracking-tight leading-none">
          $1.2M
        </span>
      </div>

      {/* ── Capacity + Active Fleets Row ── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Capacity */}
        <div className="border border-neutral-300 bg-white p-5">
          <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold block mb-3">
            CAPACITY
          </span>
          {/* Progress bar */}
          <div className="w-full bg-neutral-200 h-1 mb-3">
            <div
              className="h-1 bg-[#FF383C] transition-all duration-1000"
              style={{ width: "98%" }}
            />
          </div>
          <span className="header text-[32px] md:text-[40px] font-bold text-neutral-900 leading-none">
            98%
          </span>
        </div>

        {/* Active Fleets */}
        <div className="border border-neutral-300 bg-white p-5">
          <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold block mb-3">
            ACTIVE FLEETS
          </span>
          <span className="header text-[32px] md:text-[40px] font-bold text-neutral-900 leading-none block mb-1">
            14
          </span>
          <span className="regular text-[9px] tracking-widest uppercase text-[#0C3E75] font-bold">
            2 EN ROUTE
          </span>
        </div>
      </div>

      {/* ── System Performance Metrics ── */}
      <div className="border border-neutral-300 bg-white p-5 mb-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
            SYSTEM PERFORMANCE METRICS
          </span>
          {/* Toggle tabs */}
          <div className="flex border border-neutral-300 overflow-hidden">
            <button
              id="tab-realtime"
              onClick={() => setActiveTab("realtime")}
              className={`regular text-[9px] tracking-widest uppercase px-4 py-1.5 font-bold transition-colors duration-200 cursor-pointer ${
                activeTab === "realtime"
                  ? "bg-[#0C3E75] text-white"
                  : "bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              REAL-TIME
            </button>
            <button
              id="tab-history"
              onClick={() => setActiveTab("history")}
              className={`regular text-[9px] tracking-widest uppercase px-4 py-1.5 font-bold transition-colors duration-200 cursor-pointer ${
                activeTab === "history"
                  ? "bg-[#0C3E75] text-white"
                  : "bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              24H HISTORY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-[#1A1A1B] border border-neutral-800 px-5 py-4 flex flex-col gap-2 hover:border-[#0C3E75] transition-colors duration-300"
            >
              <span className="regular text-[9px] tracking-widest uppercase text-neutral-400 font-bold">
                {metric.label}
              </span>
              <span className="header text-[22px] md:text-[28px] font-bold text-[#FFE6B3] leading-none">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stock Velocity Chart ── */}
      <div className="border border-neutral-300 bg-white p-5 mb-6">
        <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold block mb-4">
          STOCK VELOCITY
        </span>
        <BarChart bars={VELOCITY_BARS} showTimeLabels height={100} />
      </div>

      {/* ── Dock Activity ── */}
      <div className="border border-neutral-300 bg-white mb-6">
        <div className="px-5 pt-5 pb-3 border-b border-neutral-200">
          <span className="header text-[16px] md:text-[18px] font-bold text-neutral-900 uppercase tracking-wide">
            Dock Activity
          </span>
        </div>
        <div className="divide-y divide-neutral-200">
          {DOCK_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors duration-200"
            >
              <div className="flex flex-col gap-0.5">
                <span className="regular text-[12px] font-bold text-neutral-900 tracking-widest uppercase">
                  {activity.id}
                </span>
                <span className="regular text-[10px] text-neutral-400 tracking-widest uppercase">
                  {activity.company}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="regular text-[9px] tracking-widest text-neutral-500 uppercase hidden md:block">
                  {activity.day}
                </span>
                <StatusBadge status={activity.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Logistics Performance + System Alerts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logistics Performance */}
        <div className="border border-neutral-300 bg-white p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
              LOGISTICS PERFORMANCE
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#0C3E75] rounded-full" />
              <span className="regular text-[8px] tracking-widest uppercase text-neutral-400">
                REAL-TIME THROUGHPUT
              </span>
            </div>
          </div>
          <div className="mb-2">
            <span className="regular text-[8px] tracking-widest uppercase text-neutral-300 block mb-3">
              LN-FREIGHT
            </span>
            <BarChart bars={LOGISTICS_BARS} height={90} />
          </div>
        </div>

        {/* System Alerts */}
        <div className="border border-neutral-300 bg-white p-5">
          <span className="regular text-[10px] tracking-widest uppercase text-neutral-500 font-bold block mb-4">
            SYSTEM ALERTS
          </span>
          <div className="flex flex-col gap-3 mb-4">
            {ALERTS.map((alert, i) => (
              <div key={i} className="flex items-start gap-2">
                {alert.type === "warning" ? (
                  /* Warning triangle */
                  <svg
                    className="w-4 h-4 text-[#FF8355] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="12"
                      y1="9"
                      x2="12"
                      y2="13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="17"
                      x2="12.01"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  /* Info circle */
                  <svg
                    className="w-4 h-4 text-[#819BB7] mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="12"
                      y1="16"
                      x2="12.01"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="regular text-[10px] tracking-widest uppercase text-neutral-700 font-bold leading-snug">
                  {alert.message}
                </span>
              </div>
            ))}
          </div>

          {/* Warehouse image */}
          <div className="w-full h-[110px] bg-[#1A1A1B] border border-neutral-800 overflow-hidden">
            <img
              src="/warehouse.png"
              alt="Warehouse Interior"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
