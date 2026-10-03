import React, { useState } from 'react';
import { 
  CalendarDays, ChevronLeft, ChevronRight, Clock, 
  Sparkles, AlertCircle, Bookmark, Check
} from 'lucide-react';

interface AcademicEvent {
  id: string;
  date: string;
  dayNumber: number;
  title: string;
  category: 'Exam' | 'Holiday' | 'Deadline' | 'Fest';
  description: string;
}

export const CalendarPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const events: AcademicEvent[] = [
    { id: 'e1', date: 'Oct 05, 2026', dayNumber: 5, title: 'Hostel Maintenance Downtime', category: 'Holiday', description: 'Network router firmware maintenance.' },
    { id: 'e2', date: 'Oct 08, 2026', dayNumber: 8, title: 'DBMS Assignment 2 Deadline', category: 'Deadline', description: 'ER Modeling and SQL Query Optimization Case Study.' },
    { id: 'e3', date: 'Oct 10, 2026', dayNumber: 10, title: 'Google & Microsoft Campus Talk', category: 'Fest', description: 'Auditorium pre-placement interactive workshop.' },
    { id: 'e4', date: 'Oct 14, 2026', dayNumber: 14, title: 'Hall Ticket Portal Opens', category: 'Exam', description: 'Download admit card with room allotment.' },
    { id: 'e5', date: 'Oct 17, 2026', dayNumber: 17, title: 'CodeStorm 36-Hr Hackathon', category: 'Fest', description: 'Flagship university developer hackathon.' },
    { id: 'e6', date: 'Oct 20, 2026', dayNumber: 20, title: 'Mid-Semester Examinations Begin', category: 'Exam', description: 'Mandatory 75% attendance audit enforced.' },
    { id: 'e7', date: 'Oct 28, 2026', dayNumber: 28, title: 'Mid-Sem Examinations End', category: 'Exam', description: 'Theory papers wrap up.' },
    { id: 'e8', date: 'Oct 31, 2026', dayNumber: 31, title: 'Diwali & Autumn Break Begins', category: 'Holiday', description: 'Campus hostel leaves permitted.' }
  ];

  const filteredEvents = events.filter((e) => activeFilter === 'All' || e.category === activeFilter);

  const getCategoryBadge = (cat: AcademicEvent['category']) => {
    switch (cat) {
      case 'Exam':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      case 'Holiday':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Deadline':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Fest':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            University Academic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Autumn Term 2026 • Examination Schedules, Campus Holidays & Deadlines
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          {['All', 'Exam', 'Holiday', 'Deadline', 'Fest'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* October 2026 Calendar Grid View */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">October 2026</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              Mid-Semester Month
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Dates Grid (Sample 31 days starting Thursday) */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty placeholders before 1st Oct (Wed) */}
          <div className="p-2 text-center text-slate-300 dark:text-slate-700 text-xs">28</div>
          <div className="p-2 text-center text-slate-300 dark:text-slate-700 text-xs">29</div>
          <div className="p-2 text-center text-slate-300 dark:text-slate-700 text-xs">30</div>

          {Array.from({ length: 31 }).map((_, i) => {
            const dayNum = i + 1;
            const eventOnDay = events.find((e) => e.dayNumber === dayNum);
            const isToday = dayNum === 3;

            return (
              <div
                key={dayNum}
                className={`min-h-[70px] p-2 rounded-2xl border text-left transition-colors flex flex-col justify-between ${
                  isToday
                    ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : eventOnDay
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && <span className="text-[9px] font-bold text-indigo-600">Today</span>}
                </div>

                {eventOnDay && (
                  <div
                    className={`mt-1 p-1 rounded-lg text-[9px] font-bold truncate leading-tight ${getCategoryBadge(
                      eventOnDay.category
                    )}`}
                    title={eventOnDay.title}
                  >
                    {eventOnDay.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Milestones Timeline List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Academic Milestones & Exam Windows
        </h3>

        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0 text-center min-w-[90px]">
                  {ev.date}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {ev.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        ev.category
                      )}`}
                    >
                      {ev.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                </div>
              </div>

              <button
                onClick={() => alert(`Saved reminder for: ${ev.title} (${ev.date})`)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 self-end sm:self-auto flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Save Reminder</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
