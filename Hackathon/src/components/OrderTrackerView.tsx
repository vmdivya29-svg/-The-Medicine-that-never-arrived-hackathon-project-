import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Clock,
  Store,
  CheckCircle2,
  AlertCircle,
  Truck,
  Box,
  FileText
} from 'lucide-react';
import { OrderDetails } from '../types/meditrack';
import { meditrackService } from '../services/meditrackService';

interface OrderTrackerViewProps {
  initialOrderId?: string;
  onViewApiPayload: (title: string, endpoint: string, data: unknown) => void;
}

const SAMPLE_ORDERS = ["MT-1001", "MT-1002", "MT-1003", "MT-1004", "MT-1005"];

const STAGES = [
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Prescription & payment confirmed' },
  { key: 'Preparing Dispatch', label: 'Dispensary Packaging', desc: 'Pharmacist sealed package' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Express courier in transit' },
  { key: 'Delivered', label: 'Delivered', desc: 'Handover complete' }
];

export const OrderTrackerView: React.FC<OrderTrackerViewProps> = ({
  initialOrderId = "MT-1001",
  onViewApiPayload
}) => {
  const [orderId, setOrderId] = useState<string>(initialOrderId);
  const [order, setOrder] = useState<OrderDetails | null>(() => {
    try {
      return meditrackService.getOrder(initialOrderId);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (idToFetch: string) => {
    setError(null);
    try {
      const res = meditrackService.getOrder(idToFetch);
      setOrder(res);
      onViewApiPayload(`GET /api/orders/${idToFetch}`, `/api/orders/${idToFetch}`, res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch order details.");
      }
      setOrder(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderId);
  };

  const getStageIndex = (status: OrderDetails['status']) => {
    return STAGES.findIndex((s) => s.key === status);
  };

  const currentStageIdx = order ? getStageIndex(order.status) : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-teal-600" />
              <span>Real-Time Order Tracking</span>
            </h1>
            <p className="text-sm text-slate-600">
              Check live status, dispatch pharmacy, and estimated arrival time.
            </p>
          </div>

          {/* Sample quick buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Sample Orders:</span>
            {SAMPLE_ORDERS.map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => {
                  setOrderId(sampleId);
                  handleTrack(sampleId);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  order?.id === sampleId
                    ? 'bg-teal-700 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sampleId}
              </button>
            ))}
          </div>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g. MT-1001)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">Order Lookup Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Populated Order State */}
      {order && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  {order.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {order.medicine}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                Fulfilled by <strong className="text-slate-700">{order.pharmacy}</strong>
              </p>
            </div>

            {/* ETA Box */}
            <div className="sm:text-right bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg">
              <span className="text-xs text-slate-500 block">Delivery Status</span>
              <span className="text-base font-bold text-slate-900">
                {order.status}
              </span>
              {order.eta && (
                <span className="text-xs text-teal-700 block font-mono">
                  Estimated Arrival: ~{order.eta} ({order.eta_minutes}m)
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dispatch Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {STAGES.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div
                    key={stage.key}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/20'
                        : isPassed
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50/50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {idx === 0 && <FileText className={`w-4 h-4 ${isPassed ? 'text-teal-600' : 'text-slate-400'}`} />}
                      {idx === 1 && <Box className={`w-4 h-4 ${isPassed ? 'text-teal-600' : 'text-slate-400'}`} />}
                      {idx === 2 && <Truck className={`w-4 h-4 ${isPassed ? 'text-teal-600' : 'text-slate-400'}`} />}
                      {idx === 3 && <CheckCircle2 className={`w-4 h-4 ${isPassed ? 'text-teal-600' : 'text-slate-400'}`} />}

                      <span className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : isPassed ? 'text-slate-800' : 'text-slate-500'}`}>
                        {stage.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-snug">
                      {stage.desc}
                    </p>

                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      {isCurrent ? 'Current stage' : isPassed ? 'Completed' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500 font-medium">Prescription Verification</span>
              <p className="font-semibold text-slate-800">Verified & Sealed</p>
              <p className="text-[11px] text-slate-500">Tamper-evident medicinal pouch</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500 font-medium">Temperature Controlled</span>
              <p className="font-semibold text-slate-800">Cold-chain insulated pack</p>
              <p className="text-[11px] text-slate-500">2°C – 8°C compliance standard</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg space-y-1">
              <span className="text-slate-500 font-medium">Customer Support</span>
              <p className="font-semibold text-slate-800">1800-MED-TRACK</p>
              <p className="text-[11px] text-slate-500">24x7 Emergency pharmacy desk</p>
            </div>
          </div>

          {/* Statutory Disclaimer */}
          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold">Notice</span>
              <p>{order.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
