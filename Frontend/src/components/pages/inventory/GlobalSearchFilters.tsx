import SearchInput from "../../SearchInput/SearchInput";
import SortDropdown from "../../SortDropdown/SortDropdown";

interface GlobalSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function GlobalSearchFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: GlobalSearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="flex-1">
        <SearchInput
          id="search-inventory"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search With Item Name, Category, or ID"
        />
      </div>
      <SortDropdown
        id="sort-inventory"
        value={sortBy}
        onChange={setSortBy}
        options={[
          "Sort By Quantity",
          "Sort By Price",
          "Sort By Name",
          "Sort By ID",
        ]}
      />
    </div>
  );
}
