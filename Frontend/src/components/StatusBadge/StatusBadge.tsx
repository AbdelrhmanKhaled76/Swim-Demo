import { type Status } from '../types';

function StatusBadge({ status }: { status: Status }) {
  if (status === 'COMPLETED' || status === 'CONFIRMED') {
    return (
      <span className="regular text-[10px] tracking-widest bg-primary-500 text-white px-3 py-[6px] uppercase">
        {status}
      </span>
    );
  }
  return (
    <span className="regular text-[10px] tracking-widest border border-neutral-900 text-neutral-900 px-3 py-[6px] uppercase">
      {status || 'PENDING'}
    </span>
  );
}

export default StatusBadge;
