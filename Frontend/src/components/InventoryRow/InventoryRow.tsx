import { type InventoryItem } from "../../interfaces/InventoryTypes/inventory";


interface InventoryRowProps {
  item: InventoryItem;
}

function InventoryRow({ item }: InventoryRowProps) {
  const name = item.itemId?.name || 'Unknown Item';
  const category = item.itemId?.category || 'General';
  const price = item.itemId?.price || 0;

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr] py-4 border-b border-neutral-200 items-center">
      <div className="flex flex-col text-left">
        <span className="regular text-[11px] font-bold text-primary-500 uppercase tracking-wide">
          {name}
        </span>
        <span className="regular text-[10px] text-neutral-500 tracking-wider">
          {category}
        </span>
      </div>

      <div className="text-center md:text-right">
        <span className="regular text-[10px] tracking-widest text-secondary-500 font-bold uppercase">
          {item.quantity} ITEMS
        </span>
      </div>

      <div className="text-right">
        <span className="regular text-[10px] tracking-widest text-secondary-500 font-bold uppercase">
          {price.toFixed(2)} EGP
        </span>
      </div>
    </div>
  );
}

export default InventoryRow;
