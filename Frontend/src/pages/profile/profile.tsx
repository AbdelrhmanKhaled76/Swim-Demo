import { useState } from 'react';
import serverRoomImg from '../../assets/images/server-room.png';
import PageTitle from '../../components/PageTitle/PageTitle';
import FormSection from '../../components/FormSection/FormSection';
import FormField from '../../components/FormField/FormField';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="16" y2="18" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="14" cy="12" r="2" />
      <circle cx="8" cy="18" r="2" />
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

function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

const ROLE_OPTIONS = [
  { value: 'senior-logistics', label: 'Senior Logistics Coordinator' },
  { value: 'inventory-manager', label: 'Inventory Manager' },
  { value: 'operations-lead', label: 'Operations Lead' },
  { value: 'system-admin', label: 'System Administrator' },
  { value: 'analyst', label: 'Data Analyst' },
];

function Profile() {
  const [fullName, setFullName] = useState('Commander Elara Vance');
  const [email, setEmail] = useState('e.vance@swim-hq.io');
  const [role, setRole] = useState('senior-logistics');
  const [bio, setBio] = useState('');

  const [showToken, setShowToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const apiToken = 'SWIM-KEY-7729-LX';

  const [criticalStockAlerts, setCriticalStockAlerts] = useState(true);
  const [orderLateArrivals, setOrderLateArrivals] = useState(true);
  const [systemMaintenance, setSystemMaintenance] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(true);
  const [realtimeTelemetry, setRealtimeTelemetry] = useState(true);
  const [denseViewport, setDenseViewport] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(apiToken).catch(() => {});
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Profile updated!\nName: ${fullName}\nEmail: ${email}`);
  };

  return (
    <div className="p-section-mobile md:p-section-desktop">
      {/* Page Header */}
      <PageTitle title="Operator Settings" />

      <div className="regular text-[11px] md:text-[13px] tracking-widest text-tertiary-500 uppercase mb-1 mt-1">
        Update primary authentication details and
      </div>
      <div className="regular text-[9px] md:text-[10px] tracking-widest text-neutral-400 uppercase mb-8">
        system interaction protocols for Node-34.
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <FormSection icon={<UserIcon />} title="Operator Profile">
          <FormField
            id="profile-full-name"
            label="Full Legal Name"
            value={fullName}
            onChange={setFullName}
            placeholder="Enter your full name"
          />
          <FormField
            id="profile-email"
            label="Authentication Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />
          <FormField
            id="profile-role"
            label="Designated Rank / Role"
            as="select"
            value={role}
            onChange={setRole}
            options={ROLE_OPTIONS}
          />
          <div className="flex flex-col gap-1.5 border-t border-neutral-200 pt-5 mt-1">
            <label
              htmlFor="profile-bio"
              className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
            >
              Operational Bio
            </label>
            <textarea
              id="profile-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Input operational overview..."
              className="regular text-[12px] md:text-[13px] tracking-widest text-neutral-800 border-l-2 border-l-primary-500 border border-neutral-300 bg-white px-4 py-3 w-full placeholder:text-neutral-400 outline-none focus:border-primary-500 transition-colors resize-none"
            />
          </div>
        </FormSection>

        <FormSection icon={<ShieldIcon />} title="Security Keys">
          <div className="border border-neutral-200 bg-neutral-50 px-4 py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-500 font-bold">
                2FA Status
              </span>
              <span className="header text-[16px] md:text-[20px] font-bold tracking-widest text-primary-700 uppercase">
                Enforced
              </span>
            </div>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="#0C3E75" />
              <polyline points="9 12 11 14 15.5 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-api-token"
              className="regular text-[10px] md:text-[11px] tracking-widest uppercase text-neutral-500 font-bold"
            >
              Hardware Token
            </label>
            <div className="relative flex items-center border border-neutral-300 bg-white">
              <input
                id="profile-api-token"
                type={showToken ? 'text' : 'password'}
                readOnly
                value={apiToken}
                className="regular text-[12px] md:text-[13px] tracking-widest text-neutral-800 bg-transparent px-4 py-3 w-full outline-none pr-20 font-mono"
              />
              <div className="absolute right-0 flex items-center h-full border-l border-neutral-300 divide-x divide-neutral-300">
                <button
                  type="button"
                  onClick={() => setShowToken((v) => !v)}
                  title={showToken ? 'Hide token' : 'Show token'}
                  className="flex items-center justify-center w-9 h-full text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <EyeOffIcon />
                </button>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  title="Copy token"
                  className="flex items-center justify-center w-9 h-full text-neutral-500 hover:text-primary-600 transition-colors cursor-pointer"
                >
                  {tokenCopied ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <CopyIcon />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full border border-neutral-300 bg-white hover:bg-neutral-50 active:bg-neutral-100 py-3 transition-colors cursor-pointer"
          >
            <span className="regular text-[11px] md:text-[12px] tracking-widest uppercase text-neutral-700 font-bold">
              Change Master Passkey
            </span>
          </button>
        </FormSection>

        <FormSection icon={<SlidersIcon />} title="System Protocols">
          <div>
            <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400 font-bold block mb-1">
              Notifications
            </span>
            <div className="border border-neutral-200">
              <div className="px-4">
                <ToggleSwitch
                  id="toggle-critical-stock"
                  label="Critical Stock Alerts"
                  checked={criticalStockAlerts}
                  onChange={setCriticalStockAlerts}
                />
                <ToggleSwitch
                  id="toggle-order-late"
                  label="Order Late Arrivals"
                  checked={orderLateArrivals}
                  onChange={setOrderLateArrivals}
                />
                <ToggleSwitch
                  id="toggle-system-maintenance"
                  label="System Maintenance"
                  checked={systemMaintenance}
                  onChange={setSystemMaintenance}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="regular text-[9px] md:text-[10px] tracking-widest uppercase text-neutral-400 font-bold block mb-1">
              UI Preferences
            </span>
            <div className="border border-neutral-200">
              <div className="px-4">
                <ToggleSwitch
                  id="toggle-high-contrast"
                  label="High Contrast Mode"
                  checked={highContrastMode}
                  onChange={setHighContrastMode}
                />
                <ToggleSwitch
                  id="toggle-realtime-telemetry"
                  label="Real-Time Telemetry"
                  checked={realtimeTelemetry}
                  onChange={setRealtimeTelemetry}
                />
                <ToggleSwitch
                  id="toggle-dense-viewport"
                  label="Dense Viewport"
                  checked={denseViewport}
                  onChange={setDenseViewport}
                />
              </div>
            </div>
          </div>
        </FormSection>

        <button
          type="submit"
          id="profile-update-submit"
          className="w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-900 text-white flex items-center justify-center gap-3 py-7 transition-colors cursor-pointer group"
        >
          <span className="header text-[16px] md:text-[20px] tracking-[0.2em] uppercase font-bold leading-tight text-center">
            Update Profile
          </span>
          <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <SaveIcon />
          </span>
        </button>
      </form>

      <div className="mt-5 relative overflow-hidden" style={{ height: '160px' }}>
        <img
          src={serverRoomImg}
          alt="Server room"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/80" />
        <div className="absolute bottom-0 left-0 p-4 flex flex-col gap-1.5">
          <span className="regular text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-black font-bold leading-none drop-shadow-sm">
            Encryption Protocol: AES-256-GCM Active
          </span>
          <div className="flex items-center gap-[4px] mt-0.5">
            <span className="block h-[4px] w-[48px] bg-black" />
            <span className="block h-[4px] w-[96px] bg-black/40" />
            <span className="block h-[4px] w-[32px] bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
