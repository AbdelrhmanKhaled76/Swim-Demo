import { useNavigate } from "react-router-dom";
import Button from "../button/button";
import cancelIcon from "../../assets/icons/cancel-02.svg";
import printerIcon from "../../assets/icons/printer-icon.svg";
import stockIcon from "../../assets/icons/stock-icon.svg";
import { useTranslation } from "../../localization/i18n";

interface props {
  isOpen: boolean;
  onClose: () => void;
  idPrefix: string;
  idNum: string;
  customerName: string;
  itemCount: number;
  totalAmount: number; // value in DOLLARS, not cents
  orderId?: string;       // full MongoDB _id of the order
  transactionId?: string; // full MongoDB _id of the confirmed transaction
}

function OrderConfirmationPopup({
  isOpen,
  onClose,
  idPrefix,
  idNum,
  customerName,
  itemCount,
  totalAmount,
  orderId,
  transactionId,
}: props) {
  const navigate = useNavigate();
  const { t, language } = useTranslation("inventory");

  if (!isOpen) return null;

  const handlePrintReceipt = () => {
    const params = new URLSearchParams();
    if (orderId) params.set("orderId", orderId);
    if (transactionId) params.set("transactionId", transactionId);
    navigate(`/reciept?${params.toString()}`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-900/40">
        <div className="w-140 max-h-[80vh] overflow-y-auto bg-[#F3F3F3] shadow-2xl">
          <div className="flex h-[52px] items-center border-b border-neutral-200 bg-white px-[18px]">
            <Button
              variant="outline"
              className="rounded-none border-none bg-transparent hover:bg-transparent [&_img]:brightness-0 [&_img]:saturate-100 [&_img]:invert-[35%] [&_img]:sepia [&_img]:hue-rotate-[-10deg] [&_img]:saturate-[5000%]"
              icon={cancelIcon}
              onClick={onClose}
            >
              {""}
            </Button>
          </div>
          <div className="flex flex-col gap-[18px] bg-[#F3F3F3] p-[36px]">
            <div className="flex h-8 w-8 items-center justify-center border border-black bg-white">
              <span className="text-base font-bold leading-none text-black">✓</span>
            </div>
            <h2 className="header text-xl uppercase text-black">
              {t("popups.orderConfirmation.title")}
            </h2>
            <div className="flex flex-col gap-1">
              <label className="regular text-xs uppercase tracking-widest text-neutral-600">
                {t("popups.orderConfirmation.orderId")}
              </label>
              <p className="regular text-sm font-semibold uppercase tracking-widest text-black">
                {idPrefix}-{idNum}
              </p>
            </div>
            <p className="inter text-sm leading-relaxed text-neutral-600">
              {t("popups.orderConfirmation.description")}
            </p>
            <Button
              icon={printerIcon}
              onClick={handlePrintReceipt}
              className="w-full rounded-none border-none bg-primary-500 text-white hover:bg-primary-600"
            >
              {t("popups.orderConfirmation.printReceipt")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/history");
                onClose();
              }}
              className="w-full rounded-none border-2 border-black bg-white text-black hover:bg-neutral-100"
            >
              {t("popups.orderConfirmation.returnToHistory")}
            </Button>
            <div className="w-auto bg-black px-4 py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <label className="regular text-sm uppercase text-neutral-500">
                  {t("popups.orderConfirmation.summaryDetails")}
                </label>
                <img src={stockIcon} alt="stock icon" />
              </div>
              <div className="my-2 w-full border border-neutral-700"></div>
              <label className="regular block text-sm uppercase text-neutral-500">
                {t("popups.orderConfirmation.customerName")}
              </label>
              <p className="mb-5 font-semibold uppercase text-white">{customerName}</p>
              <label className="block text-sm uppercase text-neutral-500">
                {t("popups.orderConfirmation.itemCount")}
              </label>
              <p className="mb-5 text-white">{itemCount}</p>
              <div className="mb-5 w-full bg-primary-500 p-3 text-center">
                <label className="regular block text-sm uppercase text-white">
                  {t("popups.orderConfirmation.totalAmount")}
                </label>
                <p className="mt-1 text-lg font-semibold text-white">
                  {totalAmount.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmationPopup;
