import { useState } from 'react';
import PageTitle from '../../components/PageTitle/PageTitle';
import FormSection from '../../components/FormSection/FormSection';
import FormField from '../../components/FormField/FormField';
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper';

const CATALOGUE_ITEMS = [
  { value: 'hw-001', label: 'HW-001 — Precision Encoder Module', unitPrice: 149.99 },
  { value: 'hw-002', label: 'HW-002 — 48V Power Distribution Unit', unitPrice: 299.00 },
  { value: 'hw-003', label: 'HW-003 — Industrial Temperature Sensor', unitPrice: 59.50 },
  { value: 'hw-004', label: 'HW-004 — Servo Motor Driver (5A)', unitPrice: 89.00 },
  { value: 'hw-005', label: 'HW-005 — Ethernet Gateway Controller', unitPrice: 210.00 },
];

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function Order() {
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  const selectedCatalogueItem = CATALOGUE_ITEMS.find((i) => i.value === selectedItem);
  const estimatedTotal = selectedCatalogueItem ? selectedCatalogueItem.unitPrice * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Order submitted!\nCustomer: ${fullName}\nItem: ${selectedCatalogueItem?.label ?? '—'}\nQty: ${quantity}\nTotal: $${estimatedTotal.toFixed(2)}`);
  };

  return (
    <div className="p-section-mobile md:p-section-desktop">

      <PageTitle title="Order Management" />

      <div className="regular text-[11px] md:text-[13px] tracking-widest text-tertiary-500 uppercase mb-1 mt-1">
        System Provision
      </div>
      <div className="regular text-[9px] md:text-[10px] tracking-widest text-neutral-400 uppercase mb-8">
        Module: Order_Initialization_V4
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormSection icon={<UserIcon />} title="Customer Data">
          <FormField
            id="order-full-name"
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            placeholder=""
          />
          <FormField
            id="order-shipping-address"
            label="Shipping Address"
            as="textarea"
            rows={3}
            value={shippingAddress}
            onChange={setShippingAddress}
            placeholder=""
          />
          <FormField
            id="order-contact-email"
            label="Contact Email"
            type="email"
            value={contactEmail}
            onChange={setContactEmail}
            placeholder=""
          />
        </FormSection>

        <FormSection icon={<BoxIcon />} title="Item Selection">
          <FormField
            id="order-item-select"
            label="Choose Item"
            as="select"
            value={selectedItem}
            onChange={setSelectedItem}
            placeholder="Select Hardware Module"
            options={CATALOGUE_ITEMS}
          />

          <QuantityStepper
            id="order-quantity"
            label="Enter Quantity"
            value={quantity}
            onChange={setQuantity}
            min={1}
          />

          <div className="border border-neutral-200 bg-neutral-50 px-5 py-4 flex flex-col gap-1">
            <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400 font-bold">
              Estimated Total
            </span>
            <div className="flex items-end justify-between">
              <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400">
                USD
              </span>
              <span className="header text-[22px] md:text-[28px] font-bold tracking-tight text-primary-500 leading-none">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </FormSection>

        <button
          type="submit"
          className="w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-900 text-white flex items-center justify-center gap-3 py-7 transition-colors cursor-pointer group"
        >
          <span className="header text-[16px] md:text-[20px] tracking-[0.2em] uppercase font-bold leading-tight text-center">
            Initialize{'\n'}Order
          </span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <RocketIcon />
          </span>
        </button>
      </form>
    </div>
  );
}

export default Order;
