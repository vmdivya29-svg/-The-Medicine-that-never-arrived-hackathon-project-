import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Truck,
  Building,
  Navigation,
  Compass
} from 'lucide-react';
import { NearbyPharmaciesResponse, NearbyPharmacyItem } from '../types/meditrack';
import { meditrackService, KNOWN_PINS } from '../services/meditrackService';

interface PharmaciesViewProps {
  onViewApiPayload: (title: string, endpoint: string, data: unknown) => void;
}

export const PharmaciesView: React.FC<PharmaciesViewProps> = ({
  onViewApiPayload
}) => {
  const [pin, setPin] = useState("560001"); // Central Bangalore
  const [radius, setRadius] = useState<number>(20);
  const [data, setData] = useState<NearbyPharmaciesResponse | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<NearbyPharmacyItem | null>(null);

  const fetchPharmacies = () => {
    try {
      const res = meditrackService.getPharmacies(pin, null, null, radius);
      setData(res);
      if (res.results.length > 0 && !selectedPharmacy) {
        setSelectedPharmacy(res.results[0]);
      }
      onViewApiPayload(`GET /api/pharmacies?pin=${pin}&radius=${radius}`, "/api/pharmacies", res);
    } catch {
      // Error handled
    }
  };

  useEffect(() => {
    fetchPharmacies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, radius]);

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Nearby Pharmacy Network
            </h1>
            <p className="text-sm text-slate-600">
              Participating retail dispensaries and authorized hospital medical shops within your delivery radius.
            </p>
          </div>

          {/* Quick PIN selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Select PIN:</span>
            {KNOWN_PINS.map((p) => (
              <button
                key={p.pin}
                onClick={() => setPin(p.pin)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  pin === p.pin
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.pin}
              </button>
            ))}
          </div>
        </div>

        {/* Radius control */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700">Radius Filter:</span>
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg">
            {[2, 5, 10, 15, 20].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
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
      </div>

      {/* Main Grid: Left Radar/Map Visual, Right List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Radar Canvas / Visualizer */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Bengaluru Spatial Radar
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Origin: PIN {pin}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive geographic distance distribution from user coordinates.
            </p>
          </div>

          {/* SVG Radar Map Representation */}
          <div className="relative w-full aspect-square max-h-[340px] mx-auto bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Concentric distance circles */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="95" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="25" fill="none" stroke="#334155" strokeWidth="1" />

              {/* Crosshairs */}
              <line x1="150" y1="10" x2="150" y2="290" stroke="#1e293b" strokeWidth="1" />
              <line x1="10" y1="150" x2="290" y2="150" stroke="#1e293b" strokeWidth="1" />

              {/* Distance markings */}
              <text x="154" y="94" fill="#64748b" fontSize="8" fontFamily="monospace">10km</text>
              <text x="154" y="59" fill="#64748b" fontSize="8" fontFamily="monospace">15km</text>
              <text x="154" y="24" fill="#64748b" fontSize="8" fontFamily="monospace">20km</text>

              {/* Center User Point */}
              <circle cx="150" cy="150" r="6" fill="#0d9488" />
              <circle cx="150" cy="150" r="12" fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.6" />
              <text x="150" y="172" textAnchor="middle" fill="#5eead4" fontSize="10" fontWeight="bold">
                You (PIN {pin})
              </text>

              {/* Pharmacy Points */}
              {data?.results.map((p, idx) => {
                // Compute relative offset from center based on coordinates
                const userLat = data.user.lat;
                const userLng = data.user.lng;
                const dx = (p.lng - userLng) * 111 * Math.cos(userLat * Math.PI / 180); // roughly km
                const dy = -(p.lat - userLat) * 111; // roughly km
                // scale to 300x300 viewBox: 20km = ~120px
                const scale = 120 / (radius || 20);
                const cx = Math.max(20, Math.min(280, 150 + dx * scale));
                const cy = Math.max(20, Math.min(280, 150 + dy * scale));
                const isSelected = selectedPharmacy?.id === p.id;

                return (
                  <g
                    key={p.id}
                    onClick={() => setSelectedPharmacy(p)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "9" : "6"}
                      fill={p.delivery_on ? (isSelected ? "#f59e0b" : "#38bdf8") : "#94a3b8"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2" : "1"}
                    />
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      #{idx + 1} {p.name.split('-')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Pharmacy quick preview */}
          {selectedPharmacy && (
            <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-300">{selectedPharmacy.name}</span>
                <span className="font-mono text-slate-300">{selectedPharmacy.distanceKm} km</span>
              </div>
              <p className="text-slate-300">{selectedPharmacy.address}</p>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>ETA: ~{selectedPharmacy.etaMinutes} mins</span>
                <span>Delivery: {selectedPharmacy.delivery_on ? 'Active' : 'In-store only'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pharmacy List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900">
              Pharmacies in Range ({data?.results.length || 0})
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Delivery radii up to {radius} km
            </span>
          </div>

          <div className="space-y-3">
            {data?.results.map((pharmacy, idx) => {
              const isSelected = selectedPharmacy?.id === pharmacy.id;
              return (
                <div
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className={`bg-white rounded-xl border transition-all p-5 shadow-sm cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          {pharmacy.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{pharmacy.address}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                          pharmacy.delivery_on
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {pharmacy.delivery_on ? 'Delivery Active' : 'Pickup Only'}
                      </span>
                    </div>
                  </div>

                  {/* Specs & phone */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-slate-600">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Navigation className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{pharmacy.distanceKm} km</strong> distance
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        ETA: <strong>{pharmacy.etaMinutes} min</strong>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        Coverage: <strong>{pharmacy.radius_km} km</strong>
                      </span>
                    </div>

                    <a
                      href={`tel:${pharmacy.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{pharmacy.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory Disclaimer */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              Verified Pharmacy Registry
            </p>
            <p className="leading-relaxed">
              All listed dispensaries are registered drug stores complying with Drugs and Cosmetics Act regulations. Delivery radii are set by individual store logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
