import { type Order, gridClass } from '../types';
import StatusBadge from '../StatusBadge/StatusBadge';
import ActionButton from '../ActionButton/ActionButton';

function HistoryRow({ order }: { order: Order }) {
  const [prefix, num] = order.id.split('-');
  return (
    <div className={`${gridClass} py-5 border-b border-neutral-200 items-center`}>

      <div className="flex flex-row md:flex-col items-center justify-center">
        <span className="regular text-[11px] text-neutral-700 leading-snug">
          {prefix}<span className="hidden md:inline">-</span>
        </span>
        <span className="regular text-[11px] text-neutral-700 leading-snug md:hidden">-</span>
        <span className="regular text-[11px] text-neutral-700 leading-snug">{num}</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-0.5">
        <span className="header text-[12px] font-bold text-neutral-900 tracking-wide">{order.destination}</span>
        <span className="regular text-[10px] text-neutral-500 tracking-widest">{order.location}</span>
      </div>

      <div className="flex flex-row md:flex-col items-center justify-center gap-1 md:gap-0.5">
        <span className="header text-[13px] font-bold text-neutral-900">{order.quantity}</span>
        <span className="regular text-[10px] text-neutral-500 tracking-widest">{order.unit}</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-0.5">
        <span className="header text-[12px] font-bold text-neutral-900 tracking-wide">{order.customer}</span>
        <span className="regular text-[10px] text-neutral-500">{order.customerId}</span>
      </div>

      <div className="flex items-center justify-center">
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-end gap-2 pr-1">
        {order.status === 'PENDING' && (
          <ActionButton variant="secondary">{'EDIT\nORDER'}</ActionButton>
        )}
        <ActionButton variant="primary">{'CREATE\nRECEIPT'}</ActionButton>
      </div>

    </div>
  );
}

export default HistoryRow;
