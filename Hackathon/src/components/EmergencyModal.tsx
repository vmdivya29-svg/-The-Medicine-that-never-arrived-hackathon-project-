import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  X,
  AlertTriangle,
  Clock,
  CheckCircle,
  MapPin,
  ListFilter
} from 'lucide-react';
import { meditrackService, KNOWN_PINS } from '../services/meditrackService';
import { EmergencyRecord } from '../types/meditrack';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewApiPayload: (title: string, endpoint: string, data: unknown) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onViewApiPayload
}) => {
  const [medicine, setMedicine] = useState('');
  const [location, setLocation] = useState('');
  const [pin, setPin] = useState('560038');
  const [contact, setContact] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = meditrackService.createEmergency(medicine, location, pin, contact);
      setSubmittedRef(res.reference);
      setResponseMsg(res.message);
      onViewApiPayload(
        "POST /api/emergency",
        "/api/emergency",
        {
          request: { medicine, location, pin, contact },
          response: res
        }
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to record emergency request.");
      }
    } finally {
      setLoading(false);
    }
  };

  const emergencies: EmergencyRecord[] = meditrackService.getEmergencies();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Urgent Alert Banner */}
        <div className="bg-rose-600 text-white p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-700/80 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Emergency Priority Medicine Dispatch
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                Direct alert to nearby participating pharmacies &amp; priority logistics queue.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-rose-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 112 Call Banner */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Life-threatening condition?</strong> Immediately call 112 (National Emergency Helpline) or visit nearest emergency room.
            </span>
          </div>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md whitespace-nowrap shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112 Now</span>
          </a>
        </div>

        <div className="p-6 space-y-6">
          {submittedRef ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
                  Reference: {submittedRef}
                </span>
                <h3 className="text-xl font-bold text-slate-900 pt-2">
                  Emergency Request Broadcasted
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
                  {responseMsg}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-800">What happens next?</p>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  <li>Nearby pharmacies within PIN {pin} have been alerted to the request.</li>
                  <li>A pharmacist will contact you at <strong className="font-mono">{contact}</strong> to verify the prescription.</li>
                  <li>Keep your doctor prescription ready for verification.</li>
                </ul>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRef(null);
                    setMedicine('');
                    setLocation('');
                    setContact('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Submit Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Medicine Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Critical Medicine Required *
                </label>
                <input
                  type="text"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  placeholder="e.g. Epinephrine Auto-Injector, Salbutamol, Insulin..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* Patient Location */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Patient Location / Full Delivery Address *
                </label>
                <textarea
                  rows={2}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Flat 302, Palm Heights, 100ft Road, Indiranagar, Bengaluru"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              {/* PIN Code & Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      6-Digit PIN Code *
                    </label>
                    <span className="text-[11px] text-slate-500">e.g. 560038</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="560038"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  {/* Quick PIN click */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {KNOWN_PINS.slice(0, 4).map((p) => (
                      <button
                        key={p.pin}
                        type="button"
                        onClick={() => setPin(p.pin)}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          pin === p.pin ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.pin}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      10-Digit Mobile Number *
                    </label>
                    <span className="text-[11px] text-slate-500">Starts with 6-9</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowQueue(!showQueue)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>{showQueue ? 'Hide Emergency Queue' : 'View Emergency Queue'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{loading ? 'Transmitting...' : 'Dispatch Emergency SOS'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Collapsible Emergency Queue */}
          {showQueue && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Active Emergency Review Queue ({emergencies.length})</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Live database sync
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {emergencies.map((em) => (
                  <div
                    key={em.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-700">{em.reference}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        em.status === 'Assigned' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {em.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">{em.medicine}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{em.location} (PIN {em.pin})</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
