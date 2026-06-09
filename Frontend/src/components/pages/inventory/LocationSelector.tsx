import { type Location } from "../../../interfaces/InventoryTypes/inventory";

interface LocationSelectorProps {
  currentView: boolean;
  selectedLocation?: Location;
  activeList: Location[];
  activeLocationId: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  setSelectedLocationId: (id: string) => void;
}

export default function LocationSelector({
  currentView,
  selectedLocation,
  activeList,
  activeLocationId,
  isDropdownOpen,
  setIsDropdownOpen,
  setSelectedLocationId,
}: LocationSelectorProps) {
  return (
    <div className="mb-6 custom-dropdown-container relative">
      <h2 className="header font-bold text-[20px] md:text-[40px] tracking-widest uppercase mb-3 text-left">
        {currentView ? "WareHouse" : "Store"} Management
      </h2>
      <div className="relative w-full">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex justify-between items-center w-full header font-bold text-[20px] md:text-[36px] tracking-wide text-neutral-900 border border-neutral-300 bg-white px-6 py-4 cursor-pointer uppercase outline-none focus:border-neutral-500 hover:border-primary-500 transition-colors"
        >
          <span>
            {selectedLocation?.name ||
              `Select ${currentView ? "Warehouse" : "Store"}`}
          </span>
          <svg
            className={`w-6 h-6 text-neutral-600 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 z-50 w-full mt-1 bg-white border border-neutral-300 shadow-xl overflow-hidden animate-slide-down">
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {activeList.map((item: Location) => {
                const isSelected = item._id === activeLocationId;
                return (
                  <button
                    key={item._id}
                    onClick={() => {
                      setSelectedLocationId(item._id);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-6 py-4 text-left header font-bold text-[18px] md:text-[24px] tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-neutral-100 text-primary-700 font-extrabold"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
