import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { SurpriseData } from '../types';

interface AdminOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurprise: (surprise: SurpriseData) => void;
}

export const AdminOverviewModal: React.FC<AdminOverviewModalProps> = ({
  isOpen,
  onClose,
  onSelectSurprise
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 z-10 my-8 max-h-[85vh] flex flex-col"
          id="modal-admin-overview"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-2xl text-[#333333] font-light">Admin & Sample Testing</h3>
              <p className="text-xs text-gray-500 mt-0.5">Explore existing surprises and test recipient links</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchStats}
                className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
              <div className="text-xs text-gray-500">Total Created</div>
              <div className="text-xl font-serif font-light text-[#333333] mt-1">
                {stats?.totalSurprises ?? '...'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
              <div className="text-xs text-gray-500">Paid Surprises</div>
              <div className="text-xl font-serif font-semibold text-[#333333] mt-1">
                {stats?.paidSurprises ?? '...'}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
              <div className="text-xs text-gray-500">Upcoming Unlocks</div>
              <div className="text-xl font-serif font-light text-[#333333] mt-1">
                {stats?.upcomingUnlocks ?? '...'}
              </div>
            </div>
          </div>

          {/* List of surprises */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Active Surprises & Demos
            </div>
            {stats?.recent?.map((item: any) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-colors flex items-center justify-between text-sm"
              >
                <div>
                  <div className="font-medium text-[#333333] flex items-center gap-2">
                    <span>{item.partner_name}</span>
                    <span className="text-xs text-gray-400">from {item.sender_name}</span>
                    {item.payment_status === 'paid' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#333333] border border-gray-200 text-[10px] font-medium">
                        Paid ₹50
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>Unlock: {new Date(item.unlock_at).toLocaleString()}</span>
                    <span>• Token: <code className="bg-gray-100 px-1 rounded text-gray-700">{item.share_token}</code></span>
                  </div>
                </div>

                <a
                  href={`/s/${item.share_token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#FAF8F5] hover:bg-[#333333] hover:text-white border border-gray-200 text-xs rounded-full font-medium transition-colors flex items-center gap-1 shrink-0 text-[#333333]"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 text-xs text-center text-gray-400">
            FIRST WISH Server Engine • Storage: Active • AI: gemini-3.7-flash
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

