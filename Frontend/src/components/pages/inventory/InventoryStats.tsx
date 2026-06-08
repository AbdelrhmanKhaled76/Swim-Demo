import StatsCard from "../../StatsCard/StatsCard";
import arrowInventoryIcon from '../../../assets/icons/arrow inventory.svg';
import moneyInventoryIcon from '../../../assets/icons/money inventory.svg';

interface InventoryStatsProps {
  totalValue: number;
  totalWarehousesCount: number;
  totalStoresCount: number;
  userRole: string | null;
  selectedLocationName?: string;
  totalItemsCount?: number;
}

export default function InventoryStats({
  totalValue,
  totalWarehousesCount,
  totalStoresCount,
  userRole,
  selectedLocationName,
  totalItemsCount = 0,
}: InventoryStatsProps) {
  const isOwner = userRole === 'Owner';

  return (
    <div className="flex flex-col gap-4 mb-8">
      <StatsCard
        title="Total Inventory Value"
        value={`${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`}
        subtext={
          <span className="flex items-center justify-center md:justify-start gap-1.5">
            <img src={arrowInventoryIcon} alt="Arrow Up" className="w-3 h-2" />
            <span>+2.4% VS LAST QUARTER</span>
          </span>
        }
        variant="dark"
        icon={<img src={moneyInventoryIcon} alt="Money Icon" className="w-8 h-8" />}
      />
      {isOwner ? (
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Total Warehouses"
            value={totalWarehousesCount.toString()}
            subtext="Remaining 1"
            variant="light"
          />
          <StatsCard
            title="Total Stores"
            value={totalStoresCount.toString()}
            subtext="Remaining 2"
            variant="light"
          />
        </div>
      ) : (
        <StatsCard
          title="Active Store Details"
          value={selectedLocationName || "No Store Selected"}
          subtext={`Total Items In Store: ${totalItemsCount} | Total Stores Available: ${totalStoresCount}`}
          variant="light"
        />
      )}
    </div>
  );
}
