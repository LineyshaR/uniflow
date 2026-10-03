import React, { useState } from 'react';
import { Layers, Clock, Ticket, CheckCircle, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { QUEUE_SERVICES } from '../data/mockData';
import { QueueService, UserToken } from '../types';
import { useNotifications } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export const QueuePage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [services, setServices] = useState<QueueService[]>(QUEUE_SERVICES);
  const [userTokens, setUserTokens] = useState<UserToken[]>([
    {
      id: 'tok-demo-1',
      serviceId: 'canteen',
      serviceName: 'Food Court Express Counter',
      tokenNumber: 42,
      counter: 'Counter 1 (Main Hall)',
      estimatedTime: '2 mins',
      issuedAt: '12:45 PM',
      status: 'Ready'
    }
  ]);

  const handleTakeToken = (service: QueueService) => {
    const nextTokenNum = service.currentServing + service.totalWaiting + 1;
    const newToken: UserToken = {
      id: `tok-${Date.now()}`,
      serviceId: service.id,
      serviceName: service.title,
      tokenNumber: nextTokenNum,
      counter: service.counterName,
      estimatedTime: `${service.estimatedWaitMinutes} mins`,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting'
    };

    setUserTokens([...userTokens, newToken]);

    // Update service count
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, totalWaiting: s.totalWaiting + 1 } : s))
    );

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch {}

    addNotification({
      title: `Token #${nextTokenNum} Generated`,
      message: `You are in line for ${service.title}. Est wait: ~${service.estimatedWaitMinutes}m.`,
      type: 'queue',
      link: '/queue'
    });
  };

  const handleSimulateAdvance = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const nextServing = s.currentServing + 1;
          const nextWaiting = Math.max(0, s.totalWaiting - 1);
          return { ...s, currentServing: nextServing, totalWaiting: nextWaiting };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              REAL-TIME QUEUE MANAGEMENT
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• 5 Campus Counters Active</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Live Campus Queue Desks
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            Claim a virtual token from your phone • No standing in physical queues at CKPCET
          </p>
        </div>
      </div>

      {/* Active User Tokens Alert Bar */}
      {userTokens.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
            Your Active Tokens ({userTokens.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTokens.map((t) => {
              const svc = services.find((s) => s.id === t.serviceId);
              const peopleAhead = svc ? Math.max(0, t.tokenNumber - svc.currentServing - 1) : 0;
              const isServing = svc ? svc.currentServing >= t.tokenNumber : false;

              return (
                <div
                  key={t.id}
                  className={`p-5 rounded-3xl border shadow-2xs flex items-center justify-between gap-4 transition-all ${
                    isServing
                      ? 'border-[#047857] bg-[#ECFDF5] dark:bg-[#062318] animate-pulse'
                      : 'border-[#047857]/20 bg-white dark:bg-[#0B1B14]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-[#047857] text-white font-mono font-bold text-2xl tracking-wider text-center shrink-0 min-w-[75px] shadow-2xs">
                      #{t.tokenNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-apple text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">
                          {t.serviceName}
                        </span>
                        {isServing && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            NOW SERVING!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-0.5">{t.counter}</p>
                      <div className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">
                        Currently Serving: <span className="font-bold font-mono text-[#047857] dark:text-white">#{svc?.currentServing}</span> •{' '}
                        {peopleAhead === 0 ? (
                          <span className="text-[#047857] dark:text-[#34D399] font-bold">You are next!</span>
                        ) : (
                          <span>{peopleAhead} people ahead</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-[#526059] dark:text-[#94A3B8] block">{t.estimatedTime}</span>
                    <button
                      onClick={() => handleSimulateAdvance(t.serviceId)}
                      className="mt-2 text-[10px] px-2.5 py-1 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#E2E8E4] text-[#047857] dark:text-[#34D399] font-medium"
                      title="Simulate next call in demo"
                    >
                      Call Next
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campus Services Queue Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
            Available Service Counters
          </h2>
          <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Updates live every 30s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const hasToken = userTokens.some((t) => t.serviceId === service.id);

            return (
              <div
                key={service.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col justify-between hover:border-[#047857] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                        {service.status}
                      </span>
                      <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1.5">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#526059] dark:text-[#94A3B8]">{service.counterName}</p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Counters row */}
                  <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] text-center">
                    <div>
                      <span className="text-[10px] text-[#526059] dark:text-[#94A3B8] uppercase font-semibold font-apple">Now Serving</span>
                      <div className="text-2xl font-bold text-[#047857] dark:text-white font-mono">
                        #{service.currentServing}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#526059] dark:text-[#94A3B8] uppercase font-semibold font-apple">In Line</span>
                      <div className="text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] font-mono">
                        {service.totalWaiting}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#526059] dark:text-[#94A3B8] mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#047857]" /> Approx: ~{service.estimatedWaitMinutes}m
                    </span>
                    <button
                      onClick={() => handleSimulateAdvance(service.id)}
                      className="text-[10px] text-[#047857] hover:underline font-semibold"
                    >
                      + Sim Advance
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  {hasToken ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] text-[#526059] text-xs font-semibold cursor-not-allowed"
                    >
                      Token Already Issued
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTakeToken(service)}
                      className="w-full py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#34D399]" /> Get Digital Token
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
