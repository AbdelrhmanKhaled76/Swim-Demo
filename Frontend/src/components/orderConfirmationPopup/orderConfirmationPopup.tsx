import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import printerIcon from "../../assets/icons/printer-icon.svg";
import stockIcon from "../../assets/icons/stock-icon.svg";

interface props {
  isOpen: boolean;
  onClose: () => void;
  idPrefix: string;
  idNum: string;
  customerName: string;
  itemCount: number;
}

function OrderConfirmationPopup({
  isOpen,
  onClose,
  idPrefix,
  idNum,
  customerName,
  itemCount,
}: props) {
  if (!isOpen) return null;

  const totalAmount = 14229;

  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-900/40">
        <div className="`w-140 bg-neutral-900 shadow-2xl rounded-t-[30px] max-h-[80vh] overflow-y-auto">
          <div className="flex h-[52px] items-center justify-between bg-light-800 px-[18px] text-[14px] tracking-[1.5px] regular text-light-100 rounded-t-[30px]">
            <span className="font-semibold uppercase">order confirmation</span>
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
              order id
            </label>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              {idPrefix}-{idNum}
            </label>
            <Button icon={printerIcon}>print reciept</Button>
            <Button variant="outline" onClick={onClose} className="text-white">
              return to history
            </Button>
            <div className="bg-black w-auto rounded-md px-4 py-2">
              <div className="flex justify-between ">
                <label className="uppercase regular text-sm text-white">
                  summary details
                </label>
                <img src={stockIcon}></img>
              </div>
              <div className="w-full border my-2 border-light-100"></div>
              <label className="uppercase regular text-sm text-white ">
                customer name
              </label>
              <label className="text-white flex mb-5">{customerName}</label>
              <label className="uppercase text-white text-sm">item count</label>
              <label className="text-white flex mb-5">{itemCount}</label>
              <div className="w-full mb-5 bg-blue-900 p-2">
                <label className="text-white uppercase regular text-sm">
                  total amount
                </label>
                <label className="flex text-white text-lg">
                  {totalAmount.toLocaleString("en-us", {
                    style: "currency",
                    currency: "usd",
                  })}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmationPopup;
