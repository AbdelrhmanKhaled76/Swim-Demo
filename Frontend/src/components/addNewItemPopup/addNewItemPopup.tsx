import cancelIcon from "../../assets/icons/cancel-02.svg";
import Button from "../button/button";
import qrCodeIcon from "../../assets/icons/qr-code-icon.svg";
import printerIcon from "../../assets/icons/printer-icon.svg";
import boltIcon from "../../assets/icons/bolt-icon.svg";
import Sign from "../sign/sign";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewItemPopup({ isOpen, onClose }: props) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-900/40">
        <div className="`w-140 bg-neutral-900 shadow-2xl rounded-t-[30px] max-h-[80vh] overflow-y-auto">
          <div className="flex h-[52px] items-center justify-between bg-light-800 px-[18px] text-[14px] tracking-[1.5px] regular text-light-100 rounded-t-[30px]">
            <span className="font-semibold uppercase">add new item</span>
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
              sku identifier
            </label>
            <input
              type="text"
              placeholder="e.g., SWIM-9982-AX"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              storage zone
            </label>
            <select className="regular appearance-none w-full border border-neutral-200 p-4 text-light-100 bg-neutral-900 focus:outline-none uppercase focus:border-primary-400 transition-colors cursor-pointer">
              <option value="alpha-01" className="uppercase">
                alpha 01
              </option>
              <option value="alpha-02" className="uppercase">
                alpha 02
              </option>
            </select>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              item description
            </label>
            <textarea
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
              placeholder="Enter technical specifications and physical properties..."
            ></textarea>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              quantity
            </label>
            <input
              type="number"
              placeholder="0"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              tracking protocol
            </label>
            <div className="flex flex-row gap-5">
              <Button icon={qrCodeIcon} className="flex-1">
                rfid
              </Button>
              <Button icon={printerIcon} className="flex-1">
                print tag
              </Button>
            </div>
            <div className="w-full border my-1 border-light-100"></div>
            <Button icon={boltIcon} className="bg-secondary-500">
              initialize entry
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

export default AddNewItemPopup;
