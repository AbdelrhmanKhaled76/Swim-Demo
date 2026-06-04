export interface ReceiptLineItemData {
  itemNo: string;
  skuIdentifier: string;
  description: string;
  qty: number;
  unitVal: number;
  currency?: string;
}

interface ReceiptLineItemProps {
  item: ReceiptLineItemData;
  isLast?: boolean;
}

function ReceiptLineItem({ item, isLast }: ReceiptLineItemProps) {
  return (
    <div
      className={`grid grid-cols-[60px_110px_1fr_60px_110px] md:grid-cols-[80px_140px_1fr_80px_130px] px-4 py-4 items-start ${
        !isLast ? 'border-b border-neutral-200' : ''
      }`}
    >
      <div className="flex items-start justify-end pr-3 pt-0.5">
        <span className="regular text-[10px] md:text-[11px] tracking-widest text-neutral-600 text-right">
          {item.itemNo}
        </span>
      </div>

      <div className="flex items-start pl-2 pt-0.5">
        <span className="regular text-[10px] md:text-[11px] tracking-widest text-primary-800 font-bold uppercase leading-snug">
          {item.skuIdentifier}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="regular text-[10px] md:text-[11px] tracking-wide text-neutral-800 leading-relaxed">
          {item.description}
        </span>
      </div>

      <div className="flex items-start pl-1 pt-0.5">
        <span className="regular text-[10px] md:text-[11px] tracking-widest text-neutral-800 font-bold">
          {item.qty.toFixed(2)}
        </span>
      </div>

      <div className="flex items-start pl-1 pt-0.5">
        <span className="regular text-[10px] md:text-[11px] tracking-widest text-neutral-800 font-bold">
          ${item.unitVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

export default ReceiptLineItem;
