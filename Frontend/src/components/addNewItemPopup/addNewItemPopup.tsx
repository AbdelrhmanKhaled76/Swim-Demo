import cancelIcon from "../../assets/icons/cancel-02.svg";
import Button from "../button/button";
import qrCodeIcon from "../../assets/icons/qr-code-icon.svg";
import printerIcon from "../../assets/icons/printer-icon.svg";
import boltIcon from "../../assets/icons/bolt-icon.svg";
import Sign from "../sign/sign";
import { useState } from "react";
import apiClient from "../../core/apiClient";

interface props {
  isOpen: boolean;
  onClose: () => void;
}

function AddNewItemPopup({ isOpen, onClose }: props) {
  if (!isOpen) return null;

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const addNewItem = async () => {
    try {
      const itemData = {
        name: itemName,
        category,
        description,
        price: Number(price),
      };

      await apiClient.post("/item", itemData);
    } catch (error: any) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("FULL ERROR:", error);
    }
  };

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
              item name
            </label>
            <input
              type="text"
              onChange={(e) => setItemName(e.target.value)}
              value={itemName}
              placeholder="item name"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="item category"
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
            />
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              item description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="regular w-full border border-neutral-200 p-4 text-light-100 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
              placeholder="Enter technical specifications and physical properties..."
            ></textarea>
            <label className="regular text-xs text-light-100 uppercase tracking-widest">
              price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
            <Button
              icon={boltIcon}
              className="bg-secondary-500"
              onClick={addNewItem}
            >
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
