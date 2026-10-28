import React from 'react';
import { Activity, ShieldAlert, Store, Search, Navigation, PackageCheck } from 'lucide-react';

interface TopBarProps {
  activeTab: 'search' | 'pharmacies' | 'orders' | 'dashboard';
  setActiveTab: (tab: 'search' | 'pharmacies' | 'orders' | 'dashboard') => void;
  onOpenEmergency: () => void;
  isLoggedIn: boolean;
  loggedInPharmacyName?: string;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  isLoggedIn,
  loggedInPharmacyName,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveTab('search')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors whitespace-nowrap">
              MediTrack
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links, single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'search'
                ? 'text-teal-700 border-teal-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacies')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'pharmacies'
                ? 'text-teal-700 border-teal-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Nearby Pharmacies</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'orders'
                ? 'text-teal-700 border-teal-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Track Order</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-teal-700 border-teal-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isLoggedIn ? (loggedInPharmacyName ? `Portal (${loggedInPharmacyName.split('-')[0].trim()})` : 'Pharmacy Portal') : 'Pharmacy Portal'}</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-500 font-mono">
                Auth Active
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Dispatch</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav subrow */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 text-xs bg-slate-50 text-slate-600">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-2 py-1 rounded ${activeTab === 'search' ? 'font-bold text-teal-700 bg-teal-50' : ''}`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab('pharmacies')}
          className={`px-2 py-1 rounded ${activeTab === 'pharmacies' ? 'font-bold text-teal-700 bg-teal-50' : ''}`}
        >
          Pharmacies
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-2 py-1 rounded ${activeTab === 'orders' ? 'font-bold text-teal-700 bg-teal-50' : ''}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'font-bold text-teal-700 bg-teal-50' : ''}`}
        >
          Portal
        </button>
      </div>
    </header>
  );
};
