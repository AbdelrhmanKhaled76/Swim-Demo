import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { 
  fetchAllLocations, 
  selectTotalStores, 
  selectTotalWarehouses, 
  createLocation 
} from '../../store/slices/InventorySclice';
import FormSection from '../../components/FormSection/FormSection';
import FormField from '../../components/FormField/FormField';

function StoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export default function LocationManager() {
  const dispatch = useDispatch<AppDispatch>();
  const stores = useSelector(selectTotalStores);
  const warehouses = useSelector(selectTotalWarehouses);
  
  const [activeTab, setActiveTab] = useState<'store' | 'warehouse'>('store');
  
  // Form State
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    dispatch(createLocation({
      name,
      type: activeTab === 'store' ? 'Store' : 'Warehouse',
      locationDetails: details
    })).then(() => {
      setName('');
      setDetails('');
    });
  };

  const locationsList = activeTab === 'store' ? stores : warehouses;

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="flex border-b border-neutral-300">
        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className={`px-6 py-3 header text-[14px] tracking-widest uppercase font-bold transition-colors cursor-pointer ${
            activeTab === 'store' 
              ? 'border-b-2 border-primary-800 text-primary-800' 
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Stores ({stores.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('warehouse')}
          className={`px-6 py-3 header text-[14px] tracking-widest uppercase font-bold transition-colors cursor-pointer ${
            activeTab === 'warehouse' 
              ? 'border-b-2 border-primary-800 text-primary-800' 
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Warehouses ({warehouses.length})
        </button>
      </div>

      <FormSection 
        icon={activeTab === 'store' ? <StoreIcon /> : <WarehouseIcon />} 
        title={`Manage ${activeTab === 'store' ? 'Stores' : 'Warehouses'}`}
      >
        <div className="mb-6">
          <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-3">
            Current {activeTab === 'store' ? 'Stores' : 'Warehouses'}
          </h3>
          {locationsList.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">No locations found.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {locationsList.map((loc) => (
                <li key={loc._id} className="border border-neutral-200 bg-neutral-50 px-4 py-3 flex justify-between items-center">
                  <span className="font-bold text-primary-800 uppercase tracking-wider text-sm">{loc.name}</span>
                  {loc.locationDetails && (
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">{loc.locationDetails}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-neutral-200 pt-5 mt-5">
          <h3 className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-500 font-bold mb-4">
            Create New {activeTab === 'store' ? 'Store' : 'Warehouse'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id={`new-${activeTab}-name`}
              label={`${activeTab === 'store' ? 'Store' : 'Warehouse'} Name`}
              value={name}
              onChange={setName}
              placeholder="e.g. Node-Alpha"
            />
            <FormField
              id={`new-${activeTab}-details`}
              label="Location Details (Optional)"
              value={details}
              onChange={setDetails}
              placeholder="e.g. Sector 7G"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="mt-2 w-full border border-primary-800 text-primary-800 hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed py-3 transition-colors cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span className="regular text-[11px] md:text-[12px] tracking-widest uppercase font-bold">
                Create {activeTab === 'store' ? 'Store' : 'Warehouse'}
              </span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <SaveIcon />
              </span>
            </button>
          </form>
        </div>
      </FormSection>
    </div>
  );
}
