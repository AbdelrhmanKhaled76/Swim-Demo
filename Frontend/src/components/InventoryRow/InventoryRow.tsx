export interface InventoryItem {
  id: string;
  company: string;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
}

interface InventoryRowProps {
  item: InventoryItem;
}

function InventoryRow({ item }: InventoryRowProps) {
  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr] py-4 border-b border-neutral-200 items-center">
      <div className="flex flex-col text-left">
        <span className="regular text-[11px] font-bold text-primary-500 uppercase tracking-wide">
          {item.id}
        </span>
        <span className="regular text-[10px] text-neutral-500 tracking-wider">
          {item.company}
        </span>
      </div>

      <div className="text-center md:text-right">
        <span className="regular text-[10px] tracking-widest text-secondary-500 font-bold uppercase">
          {item.quantity} {item.unit}
        </span>
      </div>

      <div className="text-right">
        <span className="regular text-[10px] tracking-widest text-secondary-500 font-bold uppercase">
          {item.price.toFixed(2)}{item.currency}
        </span>
      </div>
    </div>
  );
}

export default InventoryRow;
