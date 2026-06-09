import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
// import stockIcon from "../../assets/icons/stock-icon.svg";
import transitIcon from "../../assets/icons/transit-icon.svg";
// import arrowRightLong from "../../assets/icons/arrow-right-long.svg";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

function MoveBetweenWarehousesPopup({ isOpen, onClose }: props) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-900/40">
        <div className="`w-140 bg-neutral-900 shadow-2xl rounded-t-[30px] max-h-[80vh] overflow-y-auto">
          <div className="flex h-[52px] items-center justify-between bg-light-800 px-[18px] text-[14px] tracking-[1.5px] regular text-light-100 rounded-t-[30px]">
            <span className="font-semibold uppercase">
              move between warehouses
            </span>
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
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              source facility
            </label>
            <select className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer">
              <option value="warehouse-01" className="uppercase">
                warehouse 01
              </option>
              <option value="warehouse-02" className="uppercase">
                warehouse 02
              </option>
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              target facility
            </label>
            <select className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer">
              <option value="warehouse-01" className="uppercase">
                warehouse 01
              </option>
              <option value="warehouse-02" className="uppercase">
                warehouse 02
              </option>
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              item selection
            </label>
            <select className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer">
              <option value="item-01" className="uppercase">
                item 01
              </option>
              <option value="item-02" className="uppercase">
                item 02
              </option>
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              quantity
            </label>
            <input
              type="number"
              placeholder="enter quantity"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <Button className="bg-secondary-500" icon={transitIcon} variant="secondary">
              initiate transfer
            </Button>
          </div>
          <label className="regular text-tertiary-400 uppercase tracking-widest pb-5 block w-full text-center ">
            system log
          </label>
        </div>
      </div>
    </>
  );
}

export default MoveBetweenWarehousesPopup;
