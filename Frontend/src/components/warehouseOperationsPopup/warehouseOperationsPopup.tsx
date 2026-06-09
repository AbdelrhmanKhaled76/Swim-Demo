import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import plusIcon from "../../assets/icons/plus-icon.svg";
import uploadIcon from "../../assets/icons/upload-icon.svg";
import arrowRightLeftIcon from "../../assets/icons/arrow-right-left-icon.svg";
import rightArrowIcon from "../../assets/icons/right-arrow-icon.svg";

interface props {
  isOpen: boolean;
  onClose: () => void;
  onAddNewItem: () => void;
  onExportToStore: () => void;
  onMoveBetweenWarehouses: () => void;
}

function WarehouseOperationsPopup({
  isOpen,
  onClose,
  onAddNewItem,
  onExportToStore,
  onMoveBetweenWarehouses,
}: props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-900/40">
      <div className="w-[560px] bg-neutral-900 shadow-2xl rounded-t-[30px]">
        <div className="flex h-[52px] items-center justify-between bg-light-800 px-[18px] text-[14px] tracking-[1.5px] regular text-light-100 rounded-t-[30px]">
          <span className="font-semibold">WAREHOUSE OPERATIONS</span>
          <Button
            variant="outline"
            className="border-none"
            icon={cancelIcon}
            onClick={onClose}
          >
            {""}
          </Button>
        </div>
        <div className="flex flex-col gap-[18px] p-[36px]">
          <Button
            icon={plusIcon}
            className="flex items-center justify-between h-[60px]"
            onClick={onAddNewItem}
          >
            <>
              <span>ADD NEW ITEM</span>
              <img src={rightArrowIcon} className="w-4 h-4" />
            </>
          </Button>

          <Button
            icon={uploadIcon}
            className="flex items-center justify-between h-[60px]"
            onClick={onExportToStore}
          >
            <>
              <span>EXPORT TO STORE</span>
              <img src={rightArrowIcon} className="w-4 h-4" />
            </>
          </Button>

          <Button
            icon={arrowRightLeftIcon}
            className="flex items-center justify-between h-[60px]"
            onClick={onMoveBetweenWarehouses}
          >
            <>
              <span>MOVE BETWEEN WAREHOUSES</span>
              <img src={rightArrowIcon} className="w-4 h-4" />
            </>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WarehouseOperationsPopup;
