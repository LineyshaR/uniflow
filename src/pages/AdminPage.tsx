import React, { useState } from 'react';
import { 
  Settings2, Utensils, ShieldAlert, Layers, Users, 
  CheckCircle, Clock, AlertTriangle, ArrowUpRight, Check
} from 'lucide-react';
import { useCanteenCart } from '../context/CanteenCartContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_COMPLAINTS, QUEUE_SERVICES } from '../data/mockData';
import { GrievanceComplaint, CanteenOrder } from '../types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { activeOrders, updateOrderStatus } = useCanteenCart();
  const [complaints, setComplaints] = useState<GrievanceComplaint[]>(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<'canteen' | 'complaints' | 'queues'>('canteen');

  const handleResolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Resolved',
              resolutionRemark: 'Verified and resolved by maintenance supervisor.'
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold font-mono">
              CAMPUS OPERATIONS CONSOLE
            </span>
            <span className="text-xs text-slate-500">• Dean / Staff Level Access</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Admin Operations & Staff Desk
          </h1>
          <p className="text-xs text-slate-500">
            Fulfill cafeteria orders, manage campus service queues, and resolve maintenance tickets
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('canteen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'canteen'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Cafeteria Fulfill ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'complaints'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Grievances ({complaints.filter(c => c.status !== 'Resolved').length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Active Orders</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {activeOrders.length}
          </div>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">Kitchen operating</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Open Grievances</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {complaints.filter(c => c.status !== 'Resolved').length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">1 Emergency priority</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Queue Counters Live</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">5 / 5</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Average wait: 9 mins</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">System Health</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">99.9%</div>
          <p className="text-[10px] text-slate-400 mt-0.5">All services online</p>
        </div>
      </div>

      {/* Tab 1: Canteen Kitchen Kitchen Order Ticket (KOT) Management */}
      {activeTab === 'canteen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              Live Kitchen Counter Orders (KOT)
            </h2>
            <span className="text-xs text-slate-400">Update status to notify student in real-time</span>
          </div>

          {activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xl font-black px-3 py-1 rounded-xl bg-amber-500 text-white">
                        #{order.tokenNumber}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {order.studentName}
                      </h3>
                      <p className="text-xs text-slate-500">Ordered at {order.orderTime}</p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        order.status === 'Ready'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1">
                    {order.items.map((i) => (
                      <div key={i.item.id} className="flex justify-between font-semibold">
                        <span>{i.item.name}</span>
                        <span>× {i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {order.status !== 'Ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready')}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Mark as "Ready for Pickup"
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                        className="flex-1 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold transition-colors"
                      >
                        Mark as "Collected"
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Utensils className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active kitchen orders</p>
              <p className="text-xs text-slate-400 mt-0.5">Orders will appear here when students checkout.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Grievances Resolution */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Campus Maintenance & Facility Redressal
            </h2>
            <span className="text-xs text-slate-400">Supervisor action log</span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{c.ticketNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-400">• {c.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-500">{c.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {c.status === 'Resolved' ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolveComplaint(c.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                    >
                      Resolve & Close Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
