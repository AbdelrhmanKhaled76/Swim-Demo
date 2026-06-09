import { type Location } from "../../../interfaces/InventoryTypes/inventory";

interface ExternalStockAlertProps {
  isCheckingElsewhere: boolean;
  otherLocationsInfo: {
    matchingItems: { _id: string; name: string; category: string }[];
    otherLocations: {
      itemId: string;
      itemName: string;
      location: Location;
      quantity: number;
    }[];
  } | null;
  isAlertDismissed: boolean;
  setIsAlertDismissed: (dismissed: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation?: Location;
  handleRequestStockForItem: (itemName: string) => void;
}

export default function ExternalStockAlert({
  isCheckingElsewhere,
  otherLocationsInfo,
  isAlertDismissed,
  setIsAlertDismissed,
  searchQuery,
  setSearchQuery,
  selectedLocation,
  handleRequestStockForItem,
}: ExternalStockAlertProps) {
  return (
    <>
      {isCheckingElsewhere && (
        <div className="mb-6 p-4 md:p-6 border border-neutral-300 bg-neutral-50 animate-pulse flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 bg-neutral-200 flex items-center justify-center flex-shrink-0">
            <svg
              className="animate-spin h-5 w-5 text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-neutral-200 rounded w-28 md:w-48 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-full max-w-[14rem] md:max-w-[24rem]"></div>
          </div>
        </div>
      )}

      {otherLocationsInfo &&
        otherLocationsInfo.otherLocations.length > 0 &&
        !isAlertDismissed && (
          <div className="mb-6 border-2 border-secondary-500 bg-[#fffaf9] p-4 md:p-6 flex flex-col items-start gap-4 transition-all duration-300 w-full">
            <div className="flex items-start gap-3 md:gap-4 w-full">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-secondary-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h3 className="header text-[14px] md:text-[20px] font-bold text-neutral-900 uppercase tracking-widest mb-1.5 leading-tight">
                  ITEMS FOUND IN OTHER LOCATIONS
                </h3>
                <p className="regular text-[10px] md:text-[13px] text-neutral-500 uppercase tracking-widest mb-4">
                  THE SEARCH QUERY "{searchQuery.toUpperCase()}" MATCHES ITEMS
                  THAT DO NOT EXIST AT{" "}
                  {selectedLocation?.name.toUpperCase() || "THIS WAREHOUSE"},
                  BUT ARE AVAILABLE ELSEWHERE:
                </p>

                <div className="flex flex-col gap-3 w-full bg-white border border-neutral-200 p-4 mb-2">
                  {otherLocationsInfo.matchingItems
                    .filter((item) =>
                      otherLocationsInfo.otherLocations.some(
                        (loc) => loc.itemId === item._id
                      )
                    )
                    .map((item) => {
                      const locationsForItem = otherLocationsInfo.otherLocations
                        .filter((loc) => loc.itemId === item._id)
                        .sort((a, b) => {
                          const typeA = a.location.type || "";
                          const typeB = b.location.type || "";
                          if (typeA === "Warehouse" && typeB !== "Warehouse")
                            return -1;
                          if (typeA !== "Warehouse" && typeB === "Warehouse")
                            return 1;
                          return 0;
                        });
                      const locsText = locationsForItem
                        .map(
                          (l) =>
                            `${l.location.name} (${l.quantity} UNIT${
                              l.quantity > 1 ? "S" : ""
                            })`
                        )
                        .join(", ");
                      return (
                        <div
                          key={item._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <span className="font-extrabold text-[12px] md:text-[14px] text-neutral-900 block truncate">
                              {item.name.toUpperCase()}
                            </span>
                            <span className="regular text-[9px] md:text-[11px] text-neutral-400 block tracking-widest uppercase mt-0.5">
                              CATEGORY: {item.category.toUpperCase()} |
                              AVAILABLE ON: {locsText.toUpperCase()}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleRequestStockForItem(item.name)
                            }
                            className="flex-shrink-0 self-start sm:self-center bg-secondary-500 hover:bg-neutral-900 text-white font-bold tracking-widest text-[9px] md:text-[10px] px-3.5 py-2 uppercase transition-all duration-200 cursor-pointer focus:outline-none"
                          >
                            Request
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAlertDismissed(true);
                setSearchQuery("");
              }}
              className="flex items-center justify-center border border-neutral-300 bg-white text-neutral-500 hover:text-neutral-955 font-bold uppercase tracking-widest text-[11px] px-4 py-2.5 transition-all duration-200 cursor-pointer focus:outline-none"
              title="Dismiss Alert"
            >
              Cancel & Clear
            </button>
          </div>
        )}

      {otherLocationsInfo &&
        otherLocationsInfo.otherLocations.length === 0 &&
        !isAlertDismissed && (
          <div className="mb-6 border border-neutral-300 bg-[#fffdfa] p-4 md:p-6 flex flex-col items-start gap-4 transition-all duration-300">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="header text-[14px] md:text-[20px] font-bold text-neutral-900 uppercase tracking-widest mb-1.5 leading-tight">
                  ITEM NOT FOUND ANYWHERE
                </h3>
                <p className="regular text-[10px] md:text-[13px] font-bold tracking-widest text-neutral-500 uppercase leading-relaxed">
                  NO ACTIVE ITEMS MATCHING "{searchQuery}" WERE FOUND IN ANY OF
                  YOUR WAREHOUSES OR STORES.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAlertDismissed(true);
                setSearchQuery("");
              }}
              className="flex items-center justify-center border border-neutral-300 bg-white text-neutral-500 hover:text-neutral-955 font-bold uppercase tracking-widest text-[11px] p-3 transition-all duration-200 cursor-pointer focus:outline-none"
              title="Dismiss Alert"
              aria-label="Dismiss Alert"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
    </>
  );
}
