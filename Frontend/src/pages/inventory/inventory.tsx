import PageTitle from "../../components/PageTitle/PageTitle";
import InventoryStats from "../../components/pages/inventory/InventoryStats";
import InventoryTable from "../../components/pages/inventory/InventoryTable";
import FloatingActionButton from "../../components/floatingActionButton/floatingActionButton";
import WarehouseOperationsPopup from "../../components/warehouseOperationsPopup/warehouseOperationsPopup";
import AddNewItemPopup from "../../components/addNewItemPopup/addNewItemPopup";
import ExportToStorePopup from "../../components/exportToStorePopup/exportToStorePopup";
import MoveBetweenWarehousesPopup from "../../components/moveBetweenWarehousesPopup/moveBetweenWarehousesPopup";
import { useInventoryLogic } from "./hooks/useInventoryLogic";
import LocationSelector from "../../components/pages/inventory/LocationSelector";
import GlobalSearchFilters from "../../components/pages/inventory/GlobalSearchFilters";
import ExternalStockAlert from "../../components/pages/inventory/ExternalStockAlert";
import ImportFromWarehouse from "../../components/importFromWarehouse/importFromWarehouse";
import MoveBetweenStoresPopup from "../../components/moveBetweenStores/moveBetweenStores";

function Inventory() {
  const {
    userRole,
    isOwner,
    currentView,
    changeCurrentView,
    totalWarehouses,
    totalStores,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isDropdownOpen,
    setIsDropdownOpen,
    setSelectedLocationId,
    inventoryItems,
    inventoryStatus,
    inventoryError,
    isWarehousePopupOpen,
    setIsWarehousePopupOpen,
    isAddNewItemPopupOpen,
    setIsAddNewItemPopupOpen,
    isExportToStorePopupOpen,
    setIsExportToStorePopupOpen,
    isImportFromWarehousePopupOpen,
    setIsImportFromWarehousePopupOpen,
    isMoveBetweenWarehousesPopupOpen,
    setIsMoveBetweenWarehousesPopupOpen,
    isMoveBetweenStoresPopupOpen,
    setIsMoveBetweenStoresPopupOpen,
    otherLocationsInfo,
    isCheckingElsewhere,
    isAlertDismissed,
    setIsAlertDismissed,
    activeList,
    activeLocationId,
    selectedLocation,
    filteredItems,
    totalValue,
    handleRequestStockForItem,
  } = useInventoryLogic();

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 p-section-mobile md:p-section-desktop">
      <PageTitle title="Swim Inventory" />

      {isOwner && (
        <div className="regular flex flex-col gap-4 justify-between md:flex-row md:justify-between text-[14px] md:text-[18px] text-center md:text-left text-tertiary-500 tracking-widest uppercase mb-6 leading-relaxed">
          <span className="block md:inline ">
            switch to {currentView ? "store" : "WareHouse"} →
          </span>
          <button
            className="regular text-[14px] w-full md:w-auto tracking-widest bg-primary-700 text-white px-16 py-1.5 uppercase hover:bg-primary-800 active:bg-primary-900 transition-colors cursor-pointer"
            onClick={changeCurrentView}
          >
            {currentView ? "Store" : "WareHouse"}
          </button>
        </div>
      )}

      <InventoryStats
        totalValue={totalValue}
        totalWarehousesCount={totalWarehouses.length}
        totalStoresCount={totalStores.length}
        userRole={userRole}
        selectedLocationName={selectedLocation?.name}
        totalItemsCount={filteredItems.length}
      />

      {isOwner && (
        <LocationSelector
          currentView={currentView}
          selectedLocation={selectedLocation}
          activeList={activeList}
          activeLocationId={activeLocationId}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          setSelectedLocationId={setSelectedLocationId}
        />
      )}

      {(totalWarehouses.length > 0 || totalStores.length > 0) && (
        <GlobalSearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}

      <ExternalStockAlert
        isCheckingElsewhere={isCheckingElsewhere}
        otherLocationsInfo={otherLocationsInfo}
        isAlertDismissed={isAlertDismissed}
        setIsAlertDismissed={setIsAlertDismissed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        handleRequestStockForItem={handleRequestStockForItem}
      />

      <InventoryTable
        filteredItems={filteredItems}
        inventoryItemsCount={inventoryItems.length}
        inventoryStatus={inventoryStatus}
        inventoryError={inventoryError}
        onClearSearch={() => setSearchQuery("")}
      />

      {isOwner && (
        <>
          <FloatingActionButton
            onClick={() => setIsWarehousePopupOpen(true)}
          />

          <WarehouseOperationsPopup
            isOpen={isWarehousePopupOpen}
            onClose={() => setIsWarehousePopupOpen(false)}
            isWarehouse={currentView}
            onAddNewItem={() => {
              setIsWarehousePopupOpen(false);
              setIsAddNewItemPopupOpen(true);
            }}
            onExportToStore={() => {
              setIsWarehousePopupOpen(false);
              setIsExportToStorePopupOpen(true);
            }}
            onMoveBetweenWarehouses={() => {
              setIsWarehousePopupOpen(false);
              setIsMoveBetweenWarehousesPopupOpen(true);
            }}
            onImportFromWarehouse={() => {
              setIsWarehousePopupOpen(false);
              setIsImportFromWarehousePopupOpen(true);
            }}
            onMoveBetweenStores={() => {
              setIsWarehousePopupOpen(false);
              setIsMoveBetweenStoresPopupOpen(true);
            }}
          />

          <AddNewItemPopup
            isOpen={isAddNewItemPopupOpen}
            onClose={() => setIsAddNewItemPopupOpen(false)}
            locationId={activeLocationId}
          />

          <ExportToStorePopup
            isOpen={isExportToStorePopupOpen}
            onClose={() => setIsExportToStorePopupOpen(false)}
            warehouseId={activeLocationId}
          />

          <ImportFromWarehouse
            isOpen={isImportFromWarehousePopupOpen}
            onClose={() => setIsImportFromWarehousePopupOpen(false)}
            storeId={activeLocationId}
          ></ImportFromWarehouse>

          <MoveBetweenWarehousesPopup
            isOpen={isMoveBetweenWarehousesPopupOpen}
            onClose={() => setIsMoveBetweenWarehousesPopupOpen(false)}
          />

          <MoveBetweenStoresPopup
            isOpen={isMoveBetweenStoresPopupOpen}
            onClose={() => setIsMoveBetweenStoresPopupOpen(false)}
          ></MoveBetweenStoresPopup>
        </>
      )}
    </div>
  );
}

export default Inventory;
