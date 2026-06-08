import { useEffect, useState } from "react";
import { gridClass } from "../../components/types";
import HistoryRow from "../../components/HistoryRow/HistoryRow";
import PageTitle from "../../components/PageTitle/PageTitle";
import SearchInput from "../../components/SearchInput/SearchInput";
import SortDropdown from "../../components/SortDropdown/SortDropdown";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { fetchHistory, selectOrders } from "../../store/slices/historySclice";
import type { FetchedOrder } from "../../interfaces/historyTypes/history";

function History() {
  const dispatch = useDispatch<AppDispatch>();
  const totalOrders = useSelector(selectOrders) as FetchedOrder[];

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Sort By Date");

  const filteredOrders = (totalOrders || [])
    .filter((order) => {
      const q = searchQuery.toLowerCase();
      const customerName = (order.customerId?.name || "").toLowerCase();
      const orderId = (order._id || "").toLowerCase();
      const dateStr = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString().toLowerCase()
        : "";
      return (
        customerName.includes(q) || orderId.includes(q) || dateStr.includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "Sort By Customer Name") {
        const nameA = a.customerId?.name || "";
        const nameB = b.customerId?.name || "";
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "Sort By Date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // newest first
      }
      if (sortBy === "Sort By Order ID") {
        const idA = a._id || "";
        const idB = b._id || "";
        return idA.localeCompare(idB);
      }
      return 0;
    });

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 p-section-mobile md:p-section-desktop">
      <PageTitle title="History Management" />

      <div>
        <div className="regular text-[13px] md:text-[14px] text-center md:text-left text-tertiary-500 tracking-widest uppercase mb-6 leading-relaxed">
          <span className="block md:inline">Active Logistics Queue — </span>
          <span className="block md:inline">
            {filteredOrders.length} Items{" "}
          </span>
          <span className="block">Total</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <SortDropdown
            id="sort-by"
            value={sortBy}
            onChange={setSortBy}
            options={[
              "Sort By Date",
              "Sort By Customer Name",
              "Sort By Order ID",
            ]}
          />

          <div className="flex-1">
            <SearchInput
              id="search-item"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search With Customer Name, Date, or Order ID"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-212.5 md:min-w-full">
            <div className={`${gridClass} pb-3 border-b-2 border-neutral-300`}>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">
                  Order ID
                </span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">
                  Order Created When
                </span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">
                  Quantity
                </span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">
                  Customer
                </span>
              </div>
              <div className="flex justify-center">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold">
                  Status
                </span>
              </div>
              <div className="flex justify-end">
                <span className="regular text-[14px] tracking-widest text-neutral-500 uppercase font-bold pr-1">
                  Actions
                </span>
              </div>
            </div>

            {filteredOrders.map((order, index) => (
              <HistoryRow key={index} order={order} />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <span className="regular text-[11px] tracking-widest text-neutral-400 uppercase">
            {filteredOrders.length} of {totalOrders.length} Orders
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
