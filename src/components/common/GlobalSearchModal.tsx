import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Utensils, Bell, Users, Calendar, 
  HelpCircle, Clock, ArrowRight, X, Sparkles
} from 'lucide-react';
import { CANTEEN_ITEMS, NOTICES_DATA, INITIAL_COURSES } from '../../data/mockData';
import { BrandLogo } from './BrandLogo';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedPages = [
    { title: 'Dashboard Overview', desc: 'Summary, attendance & quick actions', path: '/', icon: Clock },
    { title: 'Academics & CGPA', desc: 'Courses, grades & attendance calculator', path: '/academics', icon: BookOpen },
    { title: 'Class Section Workspace', desc: 'CS-3A notes, CR notices & class poll', path: '/section', icon: Users },
    { title: 'Weekly Timetable', desc: 'Lecture halls & weekly class schedule', path: '/timetable', icon: Calendar },
    { title: 'Canteen & Food Court', desc: 'Order meals, snacks & grab live tokens', path: '/canteen', icon: Utensils },
    { title: 'Live Queue Desks', desc: 'Real-time tokens for Registrar, Clinic, Library', path: '/queue', icon: Clock },
    { title: 'Official Notices & Circulars', desc: 'Exam dates, alerts, placement news', path: '/notices', icon: Bell },
    { title: 'Events & Fests', desc: 'Hackathons, cultural fests, workshops', path: '/events', icon: Sparkles },
    { title: 'Campus AI Advisor', desc: 'Ask about syllabus, regulations, guidance', path: '/ai', icon: HelpCircle },
    { title: 'Grievance & Complaints Desk', desc: 'Hostel, mess, infra issue tracker', path: '/complaints', icon: HelpCircle }
  ].filter(p => !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

  const matchedCourses = INITIAL_COURSES.filter(
    c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.faculty.toLowerCase().includes(q)
  );

  const matchedCanteen = CANTEEN_ITEMS.filter(
    f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white/95 dark:bg-[#0B1B14]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#047857]/20 dark:border-white/[0.1] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (Apple Spotlight style) */}
        <div className="flex items-center px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-[#047857] dark:text-[#34D399] shrink-0" />
          <input
            type="text"
            placeholder="Search UniFlow: courses, cafeteria meals, circulars, or desks... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#141B18] dark:text-[#F3F7F5] placeholder:text-[#526059] focus:outline-none text-sm font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#526059] hover:text-[#047857]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[#526059] bg-[#F6F8F6] dark:bg-[#0E281E] rounded-md border border-black/[0.06] dark:border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-4 space-y-4 divide-y divide-black/[0.06] dark:border-white/[0.08]">
          {/* Quick Pages */}
          <div>
            <h4 className="text-[10px] font-apple font-bold uppercase tracking-wider text-[#526059] mb-2 px-2">Navigation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {matchedPages.slice(0, 6).map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.path}
                    onClick={() => handleSelect(p.path)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] text-left transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] group-hover:text-[#047857] truncate">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-[#526059] dark:text-[#94A3B8] truncate">{p.desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#526059] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canteen Items Match */}
          {matchedCanteen.length > 0 && (
            <div className="pt-3">
              <h4 className="text-[10px] font-apple font-bold uppercase tracking-wider text-[#526059] mb-2 px-2">Canteen & Meals</h4>
              <div className="space-y-1">
                {matchedCanteen.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect('/canteen')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#047857]" />
                      <span className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5]">{item.name}</span>
                      <span className="text-[10px] text-[#526059]">({item.category})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#047857] dark:text-white">₹{item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Courses Match */}
          {matchedCourses.length > 0 && (
            <div className="pt-3">
              <h4 className="text-[10px] font-apple font-bold uppercase tracking-wider text-[#526059] mb-2 px-2">Academic Modules</h4>
              <div className="space-y-1">
                {matchedCourses.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('/academics')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] text-left"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] mr-2">
                        {c.code}
                      </span>
                      <span className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5]">{c.name}</span>
                    </div>
                    <span className="text-[11px] text-[#526059]">{c.room}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#F6F8F6] dark:bg-[#07130E] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-[#526059]">
          <BrandLogo size="xs" subtitle="Institutional Spotlight" />
          <span className="font-mono text-[10px]">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
