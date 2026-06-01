import { useState } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import SearchInput from "../../components/SearchInput/SearchInput";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import StatsCard from "../../components/StatsCard/StatsCard";
import InventoryRow, { type InventoryItem } from "../../components/InventoryRow/InventoryRow";
import arrowInventoryIcon from '../../assets/icons/arrow inventory.svg';
import moneyInventoryIcon from '../../assets/icons/money inventory.svg';

const mockInventoryItems: InventoryItem[] = [
  { id: 'IN-7492', company: 'Logistics Corp', quantity: 32, unit: 'REMAINING', price: 20.00, currency: 'EGP' },
  { id: 'IN-7492', company: 'Logistics Corp', quantity: 32, unit: 'REMAINING', price: 20.00, currency: 'EGP' },
  { id: 'IN-7492', company: 'Logistics Corp', quantity: 32, unit: 'REMAINING', price: 20.00, currency: 'EGP' },
  { id: 'IN-8831', company: 'Global Transport', quantity: 15, unit: 'REMAINING', price: 45.99, currency: 'EGP' },
  { id: 'IN-6215', company: 'Oceanic Trade', quantity: 120, unit: 'REMAINING', price: 12.50, currency: 'EGP' },
];

function Inventory() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('warehouse 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Sort By Quantity');

  const filteredItems = mockInventoryItems
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'Sort By Quantity') {
        return b.quantity - a.quantity;
      }
      if (sortBy === 'Sort By Price') {
        return b.price - a.price;
      }
      if (sortBy === 'Sort By ID') {
        return a.id.localeCompare(b.id);
      }
      return 0;
    });

  return (
    <div className="p-section-mobile md:p-section-desktop ">
      <PageTitle title="Swim Inventory" />

      <div className="regular flex flex-col gap-4 justify-between md:flex-row md:justify-between text-[14px] md:text-[18px] text-center md:text-left text-tertiary-500 tracking-widest uppercase mb-6 leading-relaxed">
          <span className="block md:inline ">switch to store →</span>
          <button className="regular text-[14px] w-full md:w-auto tracking-widest bg-primary-700 text-white px-16 py-[6px] uppercase">
            store
          </button>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <StatsCard
          title="Total Inventory Value"
          value="$14.2M"
          subtext={
            <span className="flex items-center justify-center md:justify-start gap-1.5">
              <img src={arrowInventoryIcon} alt="Arrow Up" className="w-3 h-2" />
              <span>+2.4% VS LAST QUARTER</span>
            </span>
          }
          variant="dark"
          icon={<img src={moneyInventoryIcon} alt="Money Icon" className="w-8 h-8" />}
        />
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Total Warehouses"
            value="2"
            subtext="Remaining 1"
            variant="light"
          />
          <StatsCard
            title="Total Stores"
            value="5"
            subtext="Remaining 2"
            variant="light"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="header font-bold text-[20px] md:text-[40px] tracking-widest uppercase mb-3 text-left">
          Warehouse Management
        </h2>
        <div className="relative w-full">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="header font-bold text-[24px] md:text-[36px] tracking-wide text-neutral-900 border border-neutral-300 bg-white px-6 py-4 pr-12 appearance-none cursor-pointer uppercase w-full outline-none focus:border-neutral-500 transition-colors"
          >
            <option value="warehouse 1">warehouse 1</option>
            <option value="warehouse 2">warehouse 2</option>
            <option value="warehouse 3">warehouse 3</option>
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

      <div className="flex justify-between items-center mb-4">
        <span className="regular text-[11px] md:text-[12px] tracking-widest text-neutral-500 uppercase font-bold">
          {filteredItems.length} of {mockInventoryItems.length} Items
        </span>
        <button className="regular text-[11px] md:text-[12px] tracking-widest text-neutral-900 font-bold uppercase cursor-pointer hover:text-primary-500 transition-colors flex items-center gap-1">
          See All
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[1.5fr_1fr_1fr] pb-3 border-b-2 border-neutral-300">
          <div className="text-left">
            <span className="regular text-[14px] tracking-widest   uppercase ">Item</span>
          </div>
          <div className="text-center md:text-right">
            <span className="regular text-[14px] tracking-widest text-tertiary-500 uppercase ">Quantity</span>
          </div>
          <div className="text-right">
            <span className="regular text-[14px] tracking-widest text-tertiary-500 uppercase ">Price</span>
          </div>
        </div>

        {filteredItems.map((item, index) => (
          <InventoryRow key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Inventory;