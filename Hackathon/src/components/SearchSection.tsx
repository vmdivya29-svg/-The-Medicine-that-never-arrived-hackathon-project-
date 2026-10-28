import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Bot,
  Truck,
  RotateCcw
} from 'lucide-react';
import { SearchResponse, SearchResultItem } from '../types/meditrack';
import { meditrackService, KNOWN_PINS } from '../services/meditrackService';

interface SearchSectionProps {
  onSelectPharmacyForOrder?: (pharmacy: SearchResultItem, medicine: string) => void;
  onOpenEmergency: () => void;
  onViewApiPayload: (title: string, endpoint: string, data: unknown) => void;
}

const COMMON_MEDICINES = [
  "Paracetamol 650mg",
  "Amoxicillin 500mg",
  "Insulin Glargine 100IU",
  "Inhaler Salbutamol 100mcg",
  "Cetirizine 10mg",
  "Metformin 500mg"
];

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSelectPharmacyForOrder,
  onOpenEmergency,
  onViewApiPayload
}) => {
  const [medicine, setMedicine] = useState("Paracetamol 650mg");
  const [pin, setPin] = useState("560038"); // Default Indiranagar
  const [radius, setRadius] = useState<number>(20);
  const [immediate, setImmediate] = useState<boolean>(false);
  const [useGps, setUseGps] = useState<boolean>(false);
  const [gpsLat, setGpsLat] = useState<number>(12.9784);
  const [gpsLng, setGpsLng] = useState<number>(77.6408);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  const performSearch = () => {
    setError(null);
    setLoading(true);
    setOrderNotice(null);

    try {
      const response = meditrackService.search(
        medicine,
        useGps ? undefined : pin,
        useGps ? gpsLat : null,
        useGps ? gpsLng : null,
        radius,
        immediate
      );
      setData(response);
      onViewApiPayload(
        `GET /api/search?medicine=${encodeURIComponent(medicine)}&pin=${pin}&radius=${radius}&immediate=${immediate}`,
        "/api/search",
        response
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while querying medicine stock.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, immediate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleOrderClick = (item: SearchResultItem) => {
    if (item.status === "Delivery Unavailable") {
      setOrderNotice(`Delivery is unavailable for ${item.name}. You may still call them at ${item.phone} for store pickup.`);
      return;
    }
    if (onSelectPharmacyForOrder) {
      onSelectPharmacyForOrder(item, medicine);
    } else {
      setOrderNotice(`Demo order placed with ${item.name} for ${medicine}! Estimated dispatch in ${item.etaMinutes} mins.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Visual Section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-md">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/meditrack_pharmacy_dispatch_1793180493614.jpg"
            alt="Pharmacy express medication dispatch center"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative max-w-4xl px-6 py-10 sm:px-10 sm:py-14 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400 bg-teal-950/70 border border-teal-800/60 px-3 py-1 rounded-md">
            <span>Spring Boot ApiController Engine</span>
            <span>·</span>
            <span>Bengaluru Dispatch Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl text-balance">
            Real-Time Medicine Stock Locator & Express Dispatch
          </h1>

          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Verify actual inventory across authorized pharmacies within 2–20 km, calculate delivery distance, and track live ETA before dispatch.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-400" />
              Haversine Distance Routing
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              15m Prep + 15km/h Transit Model
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-teal-400" />
              CrewAI Verification Agents
            </span>
          </div>
        </div>
      </section>

      {/* Search Console Card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
        <form onSubmit={handleSearchSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Medicine Query Input */}
            <div className="md:col-span-6 space-y-1.5">
              <label htmlFor="medicine-input" className="block text-xs font-semibold text-slate-700">
                Medicine Name (2–60 chars)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="medicine-input"
                  type="text"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  placeholder="e.g. Paracetamol 650mg, Insulin Glargine..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Location Selector (PIN / GPS) */}
            <div className="md:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="pin-input" className="block text-xs font-semibold text-slate-700">
                  {useGps ? "GPS Coordinates" : "6-digit PIN Code"}
                </label>
                <button
                  type="button"
                  onClick={() => setUseGps(!useGps)}
                  className="text-xs text-teal-700 hover:text-teal-900 underline"
                >
                  {useGps ? "Switch to PIN" : "Use Coordinates"}
                </button>
              </div>

              {useGps ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={gpsLat}
                    onChange={(e) => setGpsLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                    placeholder="Lat"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={gpsLng}
                    onChange={(e) => setGpsLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                    placeholder="Lng"
                  />
                </div>
              ) : (
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="pin-input"
                    type="text"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Medicine & PIN presets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
              <span className="font-medium text-slate-700">Quick Medicines:</span>
              {COMMON_MEDICINES.map((med) => (
                <button
                  key={med}
                  type="button"
                  onClick={() => {
                    setMedicine(med);
                  }}
                  className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    medicine === med
                      ? 'bg-teal-100 text-teal-800 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {med}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 text-slate-600">
              <span className="font-medium text-slate-700">Demo PINs:</span>
              {KNOWN_PINS.slice(0, 4).map((p) => (
                <button
                  key={p.pin}
                  type="button"
                  onClick={() => {
                    setPin(p.pin);
                    setUseGps(false);
                  }}
                  title={p.area}
                  className={`px-2 py-0.5 rounded font-mono text-xs transition-colors ${
                    pin === p.pin && !useGps
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {p.pin}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar: Radius & Immediate dispatch switch */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Radius Segmented Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Search Radius:
              </span>
              <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg">
                {[2, 5, 10, 15, 20].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      radius === r
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Immediate Stock Only Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={immediate}
                  onChange={(e) => setImmediate(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <span>Immediate Delivery (Qty &gt; 0 only)</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  meditrackService.resetToDefault();
                  performSearch();
                }}
                title="Reset sample stock levels"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 px-2 rounded hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Query Validation Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Temporary Order notification */}
      {orderNotice && (
        <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-sm flex items-center justify-between gap-3">
          <p className="font-medium">{orderNotice}</p>
          <button
            onClick={() => setOrderNotice(null)}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Out-of-Stock Smart Recommendation Banner */}
      {data?.recommendation && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-800 uppercase">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Smart Recommendation Agent</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-950">
                Nearest pharmacy is out of stock. Suggested alternative:
              </p>
              <p className="text-sm text-amber-900">
                <span className="font-semibold">{data.recommendation.name}</span> has{' '}
                <span className="font-bold tabular-nums font-mono">{data.recommendation.qty} units</span> in stock ({data.recommendation.distanceKm} km away, ETA ~{data.recommendation.etaMinutes} mins).
              </p>
            </div>
            <button
              onClick={() => handleOrderClick(data.recommendation!)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              Order from {data.recommendation.name.split('-')[0].trim()}
            </button>
          </div>
        </div>
      )}

      {/* Results Header & Multi-Agent Findings */}
      {data && (
        <div className="space-y-6">
          {/* Agent Analysis Section */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  CrewAI Multi-Agent Stock Inspection
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {data.results.length} pharmacies evaluated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.agents.map((ag) => (
                <div key={ag.agent} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3.5 space-y-1.5">
                  <p className="text-xs font-semibold text-teal-300">{ag.agent}</p>
                  <p className="text-xs text-slate-300 leading-snug">{ag.finding}</p>
                  <p className="text-[10px] text-slate-400 font-mono pt-1">
                    Rule-based telemetry
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacy Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-slate-900">
                Participating Pharmacies ({data.results.length})
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Sorted by distance ascending
              </span>
            </div>

            {data.results.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
                <p className="text-base font-semibold text-slate-800">No pharmacies found with &ldquo;{medicine}&rdquo;</p>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  No participating pharmacy has this medicine in stock within {radius} km of PIN {pin}. Try increasing your radius or check emergency dispatch.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onOpenEmergency}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Create Emergency SOS Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {data.results.map((item) => {
                  const isAvailable = item.status === "Available";
                  const isLimited = item.status === "Limited Availability";
                  const isUnavailable = item.status === "Delivery Unavailable";

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">
                              {item.name}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                                isAvailable
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isLimited
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span>{item.address}</span>
                          </p>
                        </div>

                        {/* Price & Stock info */}
                        <div className="text-left sm:text-right shrink-0 space-y-0.5">
                          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                            ₹{item.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500 font-mono tabular-nums">
                            {item.qty > 0 ? (
                              <span className={item.qty <= 5 ? 'text-amber-700 font-semibold' : 'text-slate-600'}>
                                {item.qty} units in stock
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold">Out of stock</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Distance & ETA Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex flex-wrap items-center gap-4 text-slate-600">
                          <span className="flex items-center gap-1 font-mono tabular-nums">
                            <Truck className="w-3.5 h-3.5 text-slate-400" />
                            <strong className="font-semibold text-slate-800">{item.distanceKm} km</strong> away
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono tabular-nums">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Est. <strong className="font-semibold text-slate-800">{item.etaMinutes} min</strong> delivery
                          </span>
                          <span>·</span>
                          <span className="text-slate-500">
                            Service radius: {item.radius_km} km
                          </span>
                        </div>

                        {/* Order & Contact Buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>

                          <button
                            onClick={() => handleOrderClick(item)}
                            disabled={isUnavailable}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              isUnavailable
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                            }`}
                          >
                            <span>Express Order</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Official Statutory Disclaimer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Medical & Delivery Disclaimer</p>
              <p className="leading-relaxed">{data.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
