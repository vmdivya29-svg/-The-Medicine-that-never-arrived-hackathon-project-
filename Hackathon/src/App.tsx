import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { SearchSection } from './components/SearchSection';
import { PharmaciesView } from './components/PharmaciesView';
import { OrderTrackerView } from './components/OrderTrackerView';
import { PharmacyDashboardView } from './components/PharmacyDashboardView';
import { EmergencyModal } from './components/EmergencyModal';
import { ApiConsoleDrawer, ApiCallLog } from './components/ApiConsoleDrawer';
import { SearchResultItem } from './types/meditrack';
import { Activity, ShieldAlert, Phone, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'pharmacies' | 'orders' | 'dashboard'>('search');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [pharmacyName, setPharmacyName] = useState<string | undefined>(undefined);
  const [trackedOrderId, setTrackedOrderId] = useState<string>('MT-1001');
  const [apiLogs, setApiLogs] = useState<ApiCallLog[]>([]);

  const handleViewApiPayload = (title: string, endpoint: string, data: unknown) => {
    const newLog: ApiCallLog = {
      id: Math.random().toString(36).substring(2) + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      title,
      endpoint,
      data
    };
    setApiLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const handleSelectPharmacyForOrder = (pharmacy: SearchResultItem, medicineName: string) => {
    // Switch to order tracker and notify
    setTrackedOrderId('MT-1001');
    setActiveTab('orders');
    handleViewApiPayload(
      `Order placed: ${medicineName} from ${pharmacy.name}`,
      `/api/orders/MT-1001`,
      {
        orderId: 'MT-1001',
        pharmacy: pharmacy.name,
        medicine: medicineName,
        status: 'Out for Delivery',
        etaMinutes: pharmacy.etaMinutes
      }
    );
  };

  const handleLoginSuccess = (token: string, name: string) => {
    setAuthToken(token);
    setPharmacyName(name);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setPharmacyName(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar following 3-Zone Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        isLoggedIn={!!authToken}
        loggedInPharmacyName={pharmacyName}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && (
          <SearchSection
            onSelectPharmacyForOrder={handleSelectPharmacyForOrder}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onViewApiPayload={handleViewApiPayload}
          />
        )}

        {activeTab === 'pharmacies' && (
          <PharmaciesView onViewApiPayload={handleViewApiPayload} />
        )}

        {activeTab === 'orders' && (
          <OrderTrackerView
            initialOrderId={trackedOrderId}
            onViewApiPayload={handleViewApiPayload}
          />
        )}

        {activeTab === 'dashboard' && (
          <PharmacyDashboardView
            token={authToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onViewApiPayload={handleViewApiPayload}
          />
        )}
      </main>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onViewApiPayload={handleViewApiPayload}
      />

      {/* Spring Boot API Inspector Drawer */}
      <ApiConsoleDrawer
        logs={apiLogs}
        onClearLogs={() => setApiLogs([])}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-slate-900">MediTrack</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Rapid medicine inventory discovery &amp; verified pharmacy dispatch system for urgent community prescription fulfillment.
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-800">Quick Navigation</p>
              <ul className="space-y-1 text-slate-500">
                <li>
                  <button onClick={() => setActiveTab('search')} className="hover:text-teal-700">
                    Medicine Stock Locator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('pharmacies')} className="hover:text-teal-700">
                    Participating Pharmacies
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('orders')} className="hover:text-teal-700">
                    Live Order Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-teal-700">
                    Pharmacy Management Portal
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-800">Emergency &amp; Support</p>
              <div className="space-y-1 text-slate-500">
                <p className="flex items-center gap-1.5 font-semibold text-rose-700">
                  <Phone className="w-3.5 h-3.5" />
                  National Emergency: 112
                </p>
                <p>Pharmacy Logistics Desk: 1800-MED-TRACK</p>
                <p>Support Hours: 24 Hours / 7 Days</p>
                <button
                  onClick={() => setIsEmergencyOpen(true)}
                  className="text-xs text-rose-700 font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Broadcast Emergency SOS
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-800">Architecture Specs</p>
              <p className="text-slate-500 leading-relaxed">
                Powered by Spring Boot <code className="font-mono text-teal-700">ApiController</code>, Haversine routing, and CrewAI simulated agents.
              </p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono">
                API Version: v1.0.0 · Spring Boot 3.x
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} MediTrack Dispatch Services. For educational and verified prescription fulfillment demonstrations.</p>
            <p className="flex items-center gap-1 text-teal-700 font-medium">
              <HeartPulse className="w-3.5 h-3.5" />
              Patient Care &amp; Medication Safety First
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
