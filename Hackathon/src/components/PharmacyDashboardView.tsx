import React, { useState, useEffect } from 'react';
import {
  Store,
  Truck,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  KeyRound,
  Search,
  Package,
  IndianRupee,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { DashboardResponse } from '../types/meditrack';
import { meditrackService } from '../services/meditrackService';

interface PharmacyDashboardViewProps {
  token: string | null;
  onLoginSuccess: (token: string, pharmacyName: string) => void;
  onLogout: () => void;
  onViewApiPayload: (title: string, endpoint: string, data: unknown) => void;
}

const DEMO_ACCOUNTS = [
  { id: 1, name: "Apollo Pharmacy - Indiranagar", pass: "demo1" },
  { id: 2, name: "MedPlus Chemist - Koramangala", pass: "demo2" },
  { id: 3, name: "Aster Pharmacy - BTM Ring Road", pass: "demo3" },
  { id: 4, name: "Trust Chemist - JP Nagar", pass: "demo4" },
  { id: 5, name: "Manipal Health - Whitefield", pass: "demo5" }
];

export const PharmacyDashboardView: React.FC<PharmacyDashboardViewProps> = ({
  token,
  onLoginSuccess,
  onLogout,
  onViewApiPayload
}) => {
  // Login form state
  const [selectedDemoId, setSelectedDemoId] = useState<number>(1);
  const [pharmacyIdInput, setPharmacyIdInput] = useState<string>("1");
  const [passwordInput, setPasswordInput] = useState<string>("demo1");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState(10);
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null);

  // Add stock state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState('');
  const [newQty, setNewQty] = useState(25);
  const [newPrice, setNewPrice] = useState(45);
  const [stockMsg, setStockMsg] = useState<string | null>(null);

  // Fetch dashboard info
  const fetchDashboard = () => {
    if (!token) return;
    try {
      const res = meditrackService.getDashboard(`Bearer ${token}`);
      setDashboardData(res);
      setDeliveryEnabled(res.pharmacy.delivery_on === 1);
      setDeliveryRadius(res.pharmacy.radius_km);
      onViewApiPayload("GET /api/dashboard", "/api/dashboard", res);
    } catch {
      onLogout();
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const pid = parseInt(pharmacyIdInput, 10);
    if (isNaN(pid)) {
      setLoginError("Enter a valid numerical Pharmacy ID.");
      return;
    }
    try {
      const res = meditrackService.login(pid, passwordInput);
      const dash = meditrackService.getDashboard(`Bearer ${res.token}`);
      onLoginSuccess(res.token, dash.pharmacy.name);
      onViewApiPayload("POST /api/login", "/api/login", {
        request: { pharmacyId: pid },
        response: res
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Login failed.");
      }
    }
  };

  const handleDemoSelect = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedDemoId(acc.id);
    setPharmacyIdInput(acc.id.toString());
    setPasswordInput(acc.pass);
  };

  // Update Delivery settings (POST /api/dashboard/delivery)
  const handleUpdateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = meditrackService.updateDelivery(`Bearer ${token}`, deliveryEnabled, deliveryRadius);
      setDeliveryMsg("Delivery logistics settings updated successfully!");
      setTimeout(() => setDeliveryMsg(null), 3000);
      fetchDashboard();
      onViewApiPayload("POST /api/dashboard/delivery", "/api/dashboard/delivery", {
        request: { enabled: deliveryEnabled, radius: deliveryRadius },
        response: res
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setDeliveryMsg(`Error: ${err.message}`);
      }
    }
  };

  // Update single stock item (POST /api/dashboard/stock)
  const handleUpdateSingleStock = (medicineName: string, qty: number, price: number) => {
    if (!token) return;
    try {
      const res = meditrackService.updateStock(`Bearer ${token}`, medicineName, qty, price);
      setStockMsg(`Updated ${medicineName} stock (${qty} units @ ₹${price})`);
      setTimeout(() => setStockMsg(null), 3000);
      fetchDashboard();
      onViewApiPayload("POST /api/dashboard/stock", "/api/dashboard/stock", {
        request: { medicine: medicineName, qty, price },
        response: res
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStockMsg(`Error: ${err.message}`);
      }
    }
  };

  // Add new medicine to inventory
  const handleAddNewStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = meditrackService.updateStock(`Bearer ${token}`, newMedicine, newQty, newPrice);
      setStockMsg(`Added ${newMedicine} to stock!`);
      setShowAddForm(false);
      setNewMedicine('');
      fetchDashboard();
      onViewApiPayload("POST /api/dashboard/stock (New item)", "/api/dashboard/stock", {
        request: { medicine: newMedicine, qty: newQty, price: newPrice },
        response: res
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStockMsg(`Error: ${err.message}`);
      }
    }
  };

  // If NOT logged in, show Login Form
  if (!token || !dashboardData) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center mb-2">
              <Store className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Pharmacy Dispensary Portal
            </h1>
            <p className="text-xs text-slate-500">
              Authorized personnel sign-in for real-time inventory and delivery control.
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                Select Demo Pharmacy Credential:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-click test</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleDemoSelect(acc)}
                  className={`text-left px-3 py-1.5 rounded text-xs transition-colors border flex items-center justify-between ${
                    selectedDemoId === acc.id
                      ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{acc.name}</span>
                  <span className="font-mono text-[11px] text-slate-400">ID: {acc.id} / {acc.pass}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Pharmacy ID (Numerical)
              </label>
              <input
                type="number"
                value={pharmacyIdInput}
                onChange={(e) => setPharmacyIdInput(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Dispensary Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            MediTrack Spring Boot Session Authentication
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  const filteredStock = dashboardData.stock.filter((s) =>
    s.medicine.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Store Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {dashboardData.pharmacy.name}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified DL No. KA-BLR-89211
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {dashboardData.pharmacy.address} · Helpline: {dashboardData.pharmacy.phone}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Delivery & Logistics Control Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Delivery Logistics Configuration</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            POST /api/dashboard/delivery
          </span>
        </div>

        <form onSubmit={handleUpdateDelivery} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Toggle Delivery On/Off */}
          <div className="sm:col-span-4 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">
              Express Delivery Dispatch Status
            </span>
            <button
              type="button"
              onClick={() => setDeliveryEnabled(!deliveryEnabled)}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                deliveryEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>{deliveryEnabled ? 'Delivery Enabled (Accepting Orders)' : 'Delivery Disabled (In-store Only)'}</span>
            </button>
          </div>

          {/* Delivery Radius Slider */}
          <div className="sm:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Service Radius Coverage</span>
              <span className="font-mono text-teal-700 font-bold">{deliveryRadius} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 km</span>
              <span>15 km</span>
              <span>30 km</span>
            </div>
          </div>

          {/* Save Button */}
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Logistics</span>
            </button>
          </div>
        </form>

        {deliveryMsg && (
          <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{deliveryMsg}</span>
          </div>
        )}
      </div>

      {/* Stock Feedback Toast */}
      {stockMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{stockMsg}</span>
        </div>
      )}

      {/* Add New Stock Modal / Drawer */}
      {showAddForm && (
        <div className="bg-slate-50 border border-teal-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-600" />
              <span>Add / Restock Medicine</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddNewStock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Medicine Name &amp; Strength (2-60 chars)
              </label>
              <input
                type="text"
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
                placeholder="e.g. Ciprofloxacin 500mg"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Quantity Units
              </label>
              <input
                type="number"
                min={0}
                value={newQty}
                onChange={(e) => setNewQty(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Unit Price (₹)
              </label>
              <input
                type="number"
                min={0}
                step="0.5"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>

            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Stock Inventory ({filteredStock.length})
            </h2>
            <p className="text-xs text-slate-500">
              Changes update immediately in patient search and recommendation engine.
            </p>
          </div>

          {/* Search Table */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter inventory..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Inventory Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-2.5 px-4">Medicine Item</th>
                <th className="py-2.5 px-4">Current Stock</th>
                <th className="py-2.5 px-4 text-right">Unit Price (₹)</th>
                <th className="py-2.5 px-4 text-center">Quick Adjust</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.map((item) => (
                <tr key={item.medicine} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.medicine}
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums">
                    {item.qty === 0 ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                        0 (Out of stock)
                      </span>
                    ) : item.qty <= 5 ? (
                      <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        {item.qty} units (Low)
                      </span>
                    ) : (
                      <span className="text-slate-800">
                        {item.qty} units
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-800">
                    ₹{item.price.toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() =>
                          handleUpdateSingleStock(
                            item.medicine,
                            Math.max(0, item.qty - 1),
                            item.price
                          )
                        }
                        title="Reduce by 1"
                        className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      >
                        -1
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateSingleStock(
                            item.medicine,
                            item.qty + 5,
                            item.price
                          )
                        }
                        title="Restock +5"
                        className="px-2 h-7 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium rounded text-xs cursor-pointer"
                      >
                        +5
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateSingleStock(
                            item.medicine,
                            item.qty + 20,
                            item.price
                          )
                        }
                        title="Restock +20"
                        className="px-2 h-7 flex items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium rounded text-xs cursor-pointer"
                      >
                        +20
                      </button>

                      <button
                        onClick={() =>
                          handleUpdateSingleStock(
                            item.medicine,
                            0,
                            item.price
                          )
                        }
                        title="Set out of stock (simulate recommendation engine)"
                        className="px-2 h-7 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-800 font-medium rounded text-[10px] cursor-pointer"
                      >
                        Mark 0
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        const newQ = prompt(`Enter new quantity for ${item.medicine}:`, item.qty.toString());
                        if (newQ !== null) {
                          const parsedQ = parseInt(newQ, 10);
                          const newP = prompt(`Enter price in ₹ for ${item.medicine}:`, item.price.toString());
                          if (newP !== null && !isNaN(parsedQ)) {
                            handleUpdateSingleStock(item.medicine, parsedQ, parseFloat(newP));
                          }
                        }
                      }}
                      className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
                    >
                      Edit Values
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
