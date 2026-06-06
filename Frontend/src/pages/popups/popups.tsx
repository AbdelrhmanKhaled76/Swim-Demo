import { useState } from "react";
import WarehouseOperationsPopup from "../../components/warehouseOperationsPopup/warehouseOperationsPopup";
import AddNewItemPopup from "../../components/addNewItemPopup/addNewItemPopup";
import Button from "../../components/button/button";

function Popups() {
  const [isWarehousePopupOpen, setIsWarehousePopupOpen] = useState(false);

  const [isAddNewItemPopupOpen, setAddNewItemPopupOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <Button onClick={() => setIsWarehousePopupOpen(true)}>
          warehouse operations
        </Button>

        <Button onClick={() => setAddNewItemPopupOpen(true)}>
          add new item
        </Button>
      </div>

      <WarehouseOperationsPopup
        isOpen={isWarehousePopupOpen}
        onClose={() => setIsWarehousePopupOpen(false)}
      />

      <AddNewItemPopup
        isOpen={isAddNewItemPopupOpen}
        onClose={() => setAddNewItemPopupOpen(false)}
      ></AddNewItemPopup>
    </>
  );
}

export default Popups;
