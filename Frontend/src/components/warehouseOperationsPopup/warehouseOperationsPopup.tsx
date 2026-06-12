import plusIcon from "../../assets/icons/plus-icon.svg";
import uploadIcon from "../../assets/icons/upload-icon.svg";
import arrowRightLeftIcon from "../../assets/icons/arrow-right-left-icon.svg";

interface props {
  isOpen: boolean;
  onClose: () => void;
  isWarehouse: boolean;
  onAddNewItem: () => void;
  onExportToStore: () => void;
  onMoveBetweenWarehouses: () => void;
  onImportFromWarehouse: () => void;
  onMoveBetweenStores: () => void;
}

function WarehouseOperationsPopup({
  isOpen,
  onClose,
  isWarehouse,
  onAddNewItem,
  onExportToStore,
  onMoveBetweenWarehouses,
  onImportFromWarehouse,
  onMoveBetweenStores,
}: props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
      <div className="relative w-[90%] sm:w-[560px] max-w-[560px] bg-primary-900 shadow-2xl rounded-t-[16px] overflow-hidden">
        
        {/* Header */}
        <div className="relative z-20 flex h-[64px] items-center justify-between bg-light-800 px-6 text-[16px] tracking-[2px] regular text-white">
          <span className="uppercase font-bold">
            {isWarehouse ? "WAREHOUSE OPERATIONS" : "STORES OPERATIONS"}
          </span>
          <button onClick={onClose} className="text-white hover:text-white-400 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Watermarks */}
        <div className="absolute top-[64px] left-4 text-[160px] font-bold text-light-800/40 leading-none select-none pointer-events-none z-0 header">
          S
        </div>
        <div className="absolute top-[64px] right-4 text-[160px] font-bold text-light-800/40 leading-none select-none pointer-events-none z-0 header">
          W
        </div>
        <div className="absolute bottom-[-30px] left-4 text-[160px] font-bold text-light-800/40 leading-none select-none pointer-events-none z-0 header">
          I
        </div>
        <div className="absolute bottom-[-30px] right-8 text-[160px] font-bold text-light-800/40 leading-none select-none pointer-events-none z-0 header">
          M
        </div>

        <div className="relative z-10 flex flex-col gap-4 p-8">
          <button
            className="w-full flex items-center justify-between h-[80px] px-8 bg-[#2A2B2A] border border-neutral-400 rounded-[4px] hover:bg-[#333] transition-colors"
            onClick={onAddNewItem}
          >
            <div className="flex items-center gap-8">
              <img src={plusIcon} alt="add" className="w-6 h-6 filter brightness-0 invert" />
              <span className="regular text-white tracking-[0.15em] uppercase text-[14px]">ADD NEW ITEM</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <button
            className="w-full flex items-center justify-between h-[80px] px-8 bg-[#2A2B2A] border border-neutral-400 rounded-[4px] hover:bg-[#333] transition-colors"
            onClick={isWarehouse ? onExportToStore : onImportFromWarehouse}
          >
            <div className="flex items-center gap-8">
              <img src={uploadIcon} alt="export/import" className="w-6 h-6 filter brightness-0 invert" />
              <span className="regular text-white tracking-[0.15em] uppercase text-[14px]">
                {isWarehouse ? "export to store" : "import from warehouse"}
              </span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <button
            className="w-full flex items-center justify-between h-[80px] px-8 bg-[#2A2B2A] border border-neutral-400 rounded-[4px] hover:bg-[#333] transition-colors"
            onClick={isWarehouse ? onMoveBetweenWarehouses : onMoveBetweenStores}
          >
            <div className="flex items-center gap-8">
              <img src={arrowRightLeftIcon} alt="move" className="w-6 h-6 filter brightness-0 invert" />
              <span className="regular text-white tracking-[0.15em] uppercase text-[14px]">
                {isWarehouse ? "move between warehouses" : "move between stores"}
              </span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarehouseOperationsPopup;
