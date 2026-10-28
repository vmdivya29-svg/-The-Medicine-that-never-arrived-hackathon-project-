import React, { useState } from 'react';
import { Terminal, X, Copy, Check, ChevronDown, ChevronRight, Server } from 'lucide-react';

export interface ApiCallLog {
  id: string;
  timestamp: string;
  title: string;
  endpoint: string;
  data: unknown;
}

interface ApiConsoleDrawerProps {
  logs: ApiCallLog[];
  onClearLogs: () => void;
}

export const ApiConsoleDrawer: React.FC<ApiConsoleDrawerProps> = ({
  logs,
  onClearLogs
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const latestLog = logs[0];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-xs font-mono transition-all cursor-pointer"
        >
          <Server className="w-4 h-4 text-teal-400" />
          <span className="font-semibold">Spring Boot API Inspector</span>
          {logs.length > 0 && (
            <span className="bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded text-[10px]">
              {logs.length}
            </span>
          )}
        </button>
      </div>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] z-50 bg-slate-950 text-slate-200 border-l border-slate-800 shadow-2xl flex flex-col font-mono text-xs animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <div>
                <p className="font-bold text-white">com.meditrack.ApiController</p>
                <p className="text-[10px] text-slate-400">Spring Boot REST Endpoint Trace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClearLogs}
                className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:bg-slate-800"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Endpoints Quick Guide */}
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Active Endpoints Mapped:</p>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
              <span>GET /api/search</span>
              <span>GET /api/pharmacies</span>
              <span>GET /api/orders/&#123;id&#125;</span>
              <span>POST /api/emergency</span>
              <span>POST /api/login</span>
              <span>GET/POST /api/dashboard</span>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No API calls recorded yet. Interact with search, orders, or portal to generate request logs.
              </div>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedId === log.id || (!expandedId && log.id === latestLog?.id);

                return (
                  <div
                    key={log.id}
                    className="border border-slate-800 rounded-lg bg-slate-900/70 overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpand(log.id)}
                      className="p-3 bg-slate-900 flex items-center justify-between cursor-pointer hover:bg-slate-850"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="font-bold text-teal-300 truncate">
                          {log.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {log.timestamp}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Route: <code className="text-teal-400">{log.endpoint}</code></span>
                          <button
                            onClick={() => handleCopy(log.id, log.data)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white"
                          >
                            {copiedId === log.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">Copy JSON</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-2.5 bg-slate-900/90 rounded text-[11px] text-slate-300 overflow-x-auto max-h-64 leading-tight">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};
