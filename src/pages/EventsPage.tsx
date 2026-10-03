import React, { useState } from 'react';
import { 
  Sparkles, Calendar, MapPin, Ticket, 
  CheckCircle2, QrCode
} from 'lucide-react';
import { EVENTS_DATA } from '../data/mockData';
import { CampusEvent } from '../types';
import confetti from 'canvas-confetti';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>(EVENTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEventPass, setSelectedEventPass] = useState<CampusEvent | null>(null);

  const categories = ['All', 'Tech', 'Cultural', 'Workshop', 'Sports'];

  const filteredEvents = events.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  const handleRegister = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const updated = {
            ...e,
            isRegistered: true,
            registeredCount: e.registeredCount + 1
          };
          setSelectedEventPass(updated);
          try {
            confetti({ particleCount: 70, spread: 60 });
          } catch {}
          return updated;
        }
        return e;
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
              CAMPUS LIFE & STUDENT ACTIVITIES
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• SAC Verified</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Events, Fests & Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            Discover flagship college cultural fests, coding competitions, and guest talks
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0B1B14] rounded-full border border-[#047857]/20 shadow-2xs self-start sm:self-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === c
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const percentFilled = Math.round((event.registeredCount / event.maxSeats) * 100);

          return (
            <div
              key={event.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs hover:border-[#047857] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner Image */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-[10px] font-semibold text-white uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  {event.isRegistered && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Registered
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#047857] dark:text-[#34D399] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date} • {event.time}</span>
                </div>

                <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] line-clamp-1">
                  {event.title}
                </h3>

                <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-[#526059] dark:text-[#94A3B8] mt-3">
                  <MapPin className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399] shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>

                {/* Seats Progress Bar */}
                <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex justify-between text-[11px] text-[#526059] dark:text-[#94A3B8] mb-1">
                    <span>Registration Status</span>
                    <span className="font-semibold text-[#141B18] dark:text-white">
                      {event.registeredCount} / {event.maxSeats} Seats
                    </span>
                  </div>
                  <div className="w-full bg-[#F6F8F6] dark:bg-[#0E281E] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#047857] dark:bg-[#10B981] h-full rounded-full transition-all"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                {event.isRegistered ? (
                  <button
                    onClick={() => setSelectedEventPass(event)}
                    className="w-full py-2.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] hover:bg-[#D1FAE5] text-[#047857] dark:text-[#34D399] text-xs font-semibold border border-[#047857]/20 flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <QrCode className="w-4 h-4" /> View Digital Entry Pass
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(event.id)}
                    className="w-full py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4" /> RSVP & Claim Free Seat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Pass Modal */}
      {selectedEventPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] border border-[#047857]/20">
                OFFICIAL ENTRY PASS
              </span>
              <h3 className="font-apple text-lg font-bold text-[#141B18] dark:text-white mt-1">
                {selectedEventPass.title}
              </h3>
              <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-0.5">{selectedEventPass.venue}</p>
            </div>

            {/* QR Mock */}
            <div className="p-4 bg-[#F6F8F6] dark:bg-[#0E281E] rounded-2xl border border-black/[0.04] dark:border-white/[0.06] mx-auto w-48 h-48 flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-[#047857] dark:text-white" />
              <span className="text-[10px] font-mono text-[#526059] mt-1 font-semibold">PASS-2026-CS889</span>
            </div>

            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8]">
              Scan at the main entrance gate. Valid for 1 student admittance.
            </p>

            <button
              onClick={() => setSelectedEventPass(null)}
              className="w-full py-2.5 rounded-full bg-[#047857] text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
