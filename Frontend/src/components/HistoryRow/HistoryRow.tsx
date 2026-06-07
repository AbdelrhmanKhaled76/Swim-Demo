import { gridClass } from '../types';
import StatusBadge from '../StatusBadge/StatusBadge';
import ActionButton from '../ActionButton/ActionButton';
import type { FetchedOrder } from '../../interfaces/historyTypes/history';

const getOrderStatus = (createdAt: string) => {
  if (!createdAt) return 'PENDING';
  const orderTime = new Date(createdAt).getTime();
  const threshold = 24 * 60 * 60 * 1000; // 24 hours
  return (orderTime + threshold) > Date.now() ? 'PENDING' : 'COMPLETED';
};

function HistoryRow({ order }: { order: FetchedOrder }) {
  const idToUse = order._id || '';
  const parts = idToUse.includes('-') ? idToUse.split('-') : ['ORD', idToUse.substring(Math.max(0, idToUse.length - 6)).toUpperCase()];
  const prefix = parts[0];
  const num = parts[1];

  const totalQty = order.items?.reduce((sum, item: any) => sum + (item.quantity || 1), 0) || 0;
  const status = getOrderStatus(order.createdAt);

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
        <span className="header text-[12px] font-bold text-neutral-900 tracking-wide">
          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
        </span>
        <span className="regular text-[10px] text-neutral-500 tracking-widest">
          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>

      <div className="flex flex-row md:flex-col items-center justify-center gap-1 md:gap-0.5">
        <span className="header text-[13px] font-bold text-neutral-900">{totalQty}</span>
        <span className="regular text-[10px] text-neutral-500 tracking-widest">UNITS</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-0.5">
        <span className="header text-[12px] font-bold text-neutral-900 tracking-wide">
          {order.customerId?.name || 'Unknown Customer'}
        </span>
        <span className="regular text-[10px] text-neutral-500">
          {order.customerId?._id ? `ID: ${order.customerId._id.substring(Math.max(0, order.customerId._id.length - 6)).toUpperCase()}` : '—'}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center justify-end gap-2 pr-1">
        {status === 'PENDING' && (
          <ActionButton variant="secondary">{'EDIT\nORDER'}</ActionButton>
        )}
        <ActionButton variant="primary">{'CREATE\nRECEIPT'}</ActionButton>
      </div>

    </div>
  );
}

export default HistoryRow;
