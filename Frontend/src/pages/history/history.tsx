import { useState } from 'react';
import { type Order, gridClass } from '../../components/types';
import HistoryRow from '../../components/HistoryRow/HistoryRow';
import PageTitle from '../../components/PageTitle/PageTitle';
import SearchInput from '../../components/SearchInput/SearchInput';
import SortDropdown from '../../components/SortDropdown/SortDropdown';

const mockOrders: Order[] = [
  { id: 'ORD-7729', destination: 'CENTRAL HUB-04', location: 'SEATTLE, WA', quantity: '2,440', unit: 'UNIT', customer: 'MOHAMED SADEK', customerId: '32', status: 'PENDING' },
  { id: 'ORD-8104', destination: 'EAST EXP-02', location: 'BOSTON, MA', quantity: '1,200', unit: 'UNIT', customer: 'JOHN DOE', customerId: '15', status: 'COMPLETED' },
  { id: 'ORD-6215', destination: 'WEST PORT-09', location: 'LOS ANGELES, CA', quantity: '4,150', unit: 'UNIT', customer: 'ALICE SMITH', customerId: '08', status: 'PENDING' },
  { id: 'ORD-7492', destination: 'SOUTH TER-11', location: 'MIAMI, FL', quantity: '850', unit: 'UNIT', customer: 'EMILY DAVIS', customerId: '23', status: 'PENDING' },
  { id: 'ORD-9021', destination: 'NORTH FLT-05', location: 'CHICAGO, IL', quantity: '3,100', unit: 'UNIT', customer: 'MICHAEL BROWN', customerId: '47', status: 'COMPLETED' },
  { id: 'ORD-5541', destination: 'CENTRAL HUB-04', location: 'SEATTLE, WA', quantity: '1,850', unit: 'UNIT', customer: 'MOHAMED SADEK', customerId: '32', status: 'PENDING' },
  { id: 'ORD-8812', destination: 'MIDWEST ST-01', location: 'DETROIT, MI', quantity: '990', unit: 'UNIT', customer: 'SARAH WILSON', customerId: '19', status: 'PENDING' },
];

function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Sort By Quantity');

  const filteredOrders = mockOrders
    .filter((order) => {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.destination.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.location.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'Sort By Quantity') {
        const qtyA = parseInt(a.quantity.replace(/,/g, ''), 10) || 0;
        const qtyB = parseInt(b.quantity.replace(/,/g, ''), 10) || 0;
        return qtyB - qtyA; 
      }
      if (sortBy === 'Sort By Status') {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === 'Sort By Date') {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

  return (
    <div className="p-section-mobile md:p-section-desktop ">

      <PageTitle title="History Management" />

      <div>
        <div className="regular text-[13px] md:text-[14px] text-center md:text-left text-tertiary-500 tracking-widest uppercase mb-6 leading-relaxed">
          <span className="block md:inline">Active Logistics Queue — </span>
          <span className="block md:inline">{filteredOrders.length} Items </span>
          <span className="block">Total</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <SortDropdown
            id="sort-by"
            value={sortBy}
            onChange={setSortBy}
            options={['Sort By Quantity', 'Sort By Date', 'Sort By Status']}
          />

          <div className="flex-1">
            <SearchInput
              id="search-item"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search With Item Name"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-212.5 md:min-w-full">
            <div className={`${gridClass} pb-3 border-b-2 border-neutral-300`}>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">Order ID</span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">Destination</span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">Quantity</span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">Customer</span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">Status</span>
              </div>
              <div className="flex justify-end">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold pr-1">Actions</span>
              </div>
            </div>

            {filteredOrders.map((order, index) => (
              <HistoryRow key={index} order={order} />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <span className="regular text-[11px] tracking-widest text-neutral-400 uppercase">
            {filteredOrders.length} of {mockOrders.length} Orders
          </span>
          <span className="regular text-[11px] tracking-widest text-neutral-900 font-bold uppercase cursor-pointer hover:text-primary-500 transition-colors">
            See More
          </span>
        </div>
      </div>

    </div>
  );
}

export default History;
