import { useState, useEffect } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import SearchInput from "../../components/SearchInput/SearchInput";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import { type InventoryItem, type Location } from "../../interfaces/InventoryTypes/inventory";
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAllLocations, 
  selectTotalWarehouses, 
  selectTotalStores, 
  selectCurrentView, 
  setCurrentView,
  selectInventoryItems,
  selectInventoryStatus,
  selectInventoryError,
  fetchInventoryForLocation
} from '../../store/slices/InventorySclice';
import InventoryStats from '../../components/pages/inventory/InventoryStats';
import InventoryTable from '../../components/pages/inventory/InventoryTable';
import type { AppDispatch } from '../../store';

function Inventory() {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Sort By Quantity');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentView = useSelector(selectCurrentView);

  const totalWarehouses = useSelector(selectTotalWarehouses);
  const totalStores = useSelector(selectTotalStores);
  const inventoryItems = useSelector(selectInventoryItems);
  const inventoryStatus = useSelector(selectInventoryStatus);
  const inventoryError = useSelector(selectInventoryError);

  const activeList = currentView ? totalWarehouses : totalStores;

  const activeLocationId = selectedLocationId && activeList.some((loc: Location) => loc._id === selectedLocationId)
    ? selectedLocationId
    : (activeList[0]?._id || '');

  const selectedLocation = activeList.find((loc: Location) => loc._id === activeLocationId);

  const changeCurrentView = () => {
    dispatch(setCurrentView(!currentView));
  };

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeLocationId) {
      dispatch(fetchInventoryForLocation(activeLocationId));
    }
  }, [dispatch, activeLocationId]);

  const filteredItems = inventoryItems
    .filter((item: InventoryItem) => {
      if (!item.itemId) return false;
      const q = searchQuery.toLowerCase();
      return (
        item.itemId.name.toLowerCase().includes(q) ||
        item.itemId.category.toLowerCase().includes(q)
      );
    })
    .sort((a: InventoryItem, b: InventoryItem) => {
      if (sortBy === 'Sort By Quantity') {
        return b.quantity - a.quantity;
      }
      if (sortBy === 'Sort By Price') {
        const priceA = a.itemId?.price || 0;
        const priceB = b.itemId?.price || 0;
        return priceB - priceA;
      }
      if (sortBy === 'Sort By ID') {
        const nameA = a.itemId?.name || '';
        const nameB = b.itemId?.name || '';
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

  const totalValue = filteredItems.reduce((acc: number, item: InventoryItem) => {
    const price = item.itemId?.price || 0;
    return acc + (item.quantity * price);
  }, 0);

  return (
    <div className="p-section-mobile md:p-section-desktop ">
      <PageTitle title="Swim Inventory" />

      <div className="regular flex flex-col gap-4 justify-between md:flex-row md:justify-between text-[14px] md:text-[18px] text-center md:text-left text-tertiary-500 tracking-widest uppercase mb-6 leading-relaxed">
          <span className="block md:inline ">switch to  {currentView?"store":"WareHouse"}  →</span>
          <button className="regular text-[14px] w-full md:w-auto tracking-widest bg-primary-700 text-white px-16 py-1.5 uppercase"
          onClick={changeCurrentView}>
           {currentView?"Store":"WareHouse"}
          </button>
      </div>

      <InventoryStats 
        totalValue={totalValue} 
        totalWarehousesCount={totalWarehouses.length} 
        totalStoresCount={totalStores.length} 
      />

      <div className="mb-6 custom-dropdown-container relative">
        <h2 className="header font-bold text-[20px] md:text-[40px] tracking-widest uppercase mb-3 text-left">
         {currentView?"WareHouse":"Store"} Management
        </h2>
        <div className="relative w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex justify-between items-center w-full header font-bold text-[20px] md:text-[36px] tracking-wide text-neutral-900 border border-neutral-300 bg-white px-6 py-4 cursor-pointer uppercase outline-none focus:border-neutral-500 hover:border-primary-500 transition-colors"
          >
            <span>{selectedLocation?.name || `Select ${currentView ? 'Warehouse' : 'Store'}`}</span>
            <svg 
              className={`w-6 h-6 text-neutral-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
                          ? 'bg-neutral-100 text-primary-700 font-extrabold' 
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-700'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isSelected && (
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            id="search-inventory"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search With Item Name"
          />
        </div>
        <SortDropdown
          id="sort-inventory"
          value={sortBy}
          onChange={setSortBy}
          options={['Sort By Quantity', 'Sort By Price', 'Sort By ID']}
        />
      </div>

      <InventoryTable
        filteredItems={filteredItems}
        inventoryItemsCount={inventoryItems.length}
        inventoryStatus={inventoryStatus}
        inventoryError={inventoryError}
        onClearSearch={() => setSearchQuery('')}
      />
    </div>
  );
}

export default Inventory;