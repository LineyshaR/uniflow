import React, { useState } from 'react';
import { 
  Clock, MapPin, User, Bell, Printer, Filter
} from 'lucide-react';
import { TIMETABLE_DATA } from '../data/mockData';

export const TimetablePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [filterType, setFilterType] = useState<'All' | 'Lecture' | 'Lab' | 'Tutorial'>('All');
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    tt1: true,
    tt2: true
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSlots = TIMETABLE_DATA.filter((slot) => {
    const dayMatches = slot.day === selectedDay;
    const typeMatches = filterType === 'All' || slot.type === filterType;
    return dayMatches && typeMatches;
  });

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Weekly Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            C.K. Pithawala Engineering Routine • Section CS-3A • Lecture Halls & Labs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] transition-colors"
          >
            <Printer className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Day Selector & Type Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20 shadow-2xs">
        {/* Days Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-0.5">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857] hover:bg-[#F6F8F6]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-2">
          <Filter className="w-3.5 h-3.5 text-[#526059]" />
          {(['All', 'Lecture', 'Lab', 'Tutorial'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                filterType === type
                  ? 'bg-[#047857] text-white'
                  : 'text-[#526059] hover:bg-[#F6F8F6]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Schedule Cards */}
      <div className="space-y-3">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => {
            const hasReminder = reminders[slot.id];
            return (
              <div
                key={slot.id}
                className="p-5 rounded-3xl border border-[#047857]/20 bg-white dark:bg-[#0B1B14] hover:border-[#047857] transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div className="p-3 rounded-2xl bg-[#ECFDF5] dark:bg-[#062318] border border-[#047857]/15 shrink-0 text-center min-w-[110px]">
                    <div className="text-xs font-bold text-[#047857] dark:text-[#34D399] font-mono">
                      {slot.startTime}
                    </div>
                    <div className="text-[10px] text-[#526059] dark:text-[#94A3B8] font-mono">to {slot.endTime}</div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                        {slot.courseCode}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-[#526059] dark:text-[#94A3B8]">
                        {slot.type}
                      </span>
                    </div>
                    <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">{slot.courseName}</h3>
                    <div className="flex items-center gap-4 text-xs text-[#526059] dark:text-[#94A3B8] flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> Room {slot.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> {slot.faculty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Reminder Toggle */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => toggleReminder(slot.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      hasReminder
                        ? 'bg-[#047857] text-white shadow-2xs'
                        : 'bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#E2E8E4] text-[#047857] dark:text-[#34D399] border border-black/[0.04]'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{hasReminder ? 'Alert Set' : 'Notify Me'}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#0B1B14] rounded-3xl border border-[#047857]/20">
            <Clock className="w-10 h-10 mx-auto text-[#526059] opacity-50 mb-2" />
            <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-white">No sessions scheduled</h4>
            <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
              There are no {filterType !== 'All' ? filterType.toLowerCase() + ' ' : ''}classes for {selectedDay}.
            </p>
          </div>
        )}
      </div>

      {/* Laboratory Notice */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 text-xs text-[#526059] dark:text-[#94A3B8] flex items-center justify-between">
        <span>⚠️ College Regulation: Students must carry institutional Smart ID cards for all engineering practical labs.</span>
        <span className="font-mono text-[10px] font-semibold text-[#047857] dark:text-[#34D399]">CKPCET Rules 104</span>
      </div>
    </div>
  );
};
