import React, { useState } from 'react';
import { 
  BellRing, Search, Pin, AlertCircle, FileText, 
  Download, Plus
} from 'lucide-react';
import { NOTICES_DATA } from '../data/mockData';
import { Notice } from '../types';
import { useAuth } from '../context/AuthContext';

export const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>(NOTICES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // New notice form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Notice['category']>('Academic');
  const [newContent, setNewContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const categories = ['All', 'Academic', 'Exams', 'Placement', 'Administrative', 'Events'];

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const canPublish = user?.role === 'admin' || user?.role === 'faculty' || user?.role === 'cr';

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const notice: Notice = {
      id: `n-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: user?.name || 'Authorized Signatory',
      authorRole: user?.role === 'admin' ? 'Dean of Affairs' : user?.role === 'cr' ? 'Class Rep' : 'Faculty',
      date: 'Today',
      isPinned: false,
      isUrgent: isUrgent,
      attachments: []
    };

    setNotices([notice, ...notices]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
    setIsUrgent(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              OFFICIAL CIRCULARS & NOTICES
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• CKPCET Administration</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Notices & Campus Circulars
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            Official circulars, examination instructions, and placement schedules
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-xs font-semibold text-white shadow-xs self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Publish Circular</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#526059] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars by keyword, exam, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] text-xs text-[#141B18] dark:text-[#F3F7F5] placeholder:text-[#526059] focus:outline-none focus:ring-2 focus:ring-[#047857]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:bg-[#F6F8F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className={`p-5 sm:p-6 rounded-3xl border shadow-2xs transition-all cursor-pointer ${
              notice.isUrgent
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-400'
                : 'bg-white dark:bg-[#0B1B14] border-[#047857]/20 hover:border-[#047857]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-apple font-bold uppercase px-2 py-0.5 rounded-full bg-[#047857] text-white">
                      <Pin className="w-3 h-3 text-[#34D399]" /> Pinned
                    </span>
                  )}
                  {notice.isUrgent && (
                    <span className="flex items-center gap-1 text-[10px] font-apple font-bold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                      <AlertCircle className="w-3 h-3" /> Priority Circular
                    </span>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                    {notice.category}
                  </span>
                  <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Issued: {notice.date}</span>
                </div>

                <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                  {notice.title}
                </h3>

                <p className="text-xs text-[#526059] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-[#526059] dark:text-[#94A3B8] pt-1">
                  <span>Signatory: <strong className="text-[#141B18] dark:text-[#F3F7F5]">{notice.author}</strong> ({notice.authorRole})</span>
                  {notice.departmentScope && <span>• Scope: {notice.departmentScope}</span>}
                </div>
              </div>

              {notice.attachments && notice.attachments.length > 0 && (
                <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                  <span className="text-xs font-semibold text-[#047857] dark:text-[#34D399] flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {notice.attachments.length} Official Annexures
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#047857] dark:text-[#34D399]">
                  {selectedNotice.category} • CKPCET Circular No: 2026/{selectedNotice.id}
                </span>
                <h2 className="font-apple text-xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1">
                  {selectedNotice.title}
                </h2>
                <div className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
                  Date: {selectedNotice.date} • Issued by {selectedNotice.author} ({selectedNotice.authorRole})
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-[#526059] hover:text-[#047857] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] text-xs sm:text-sm text-[#141B18] dark:text-[#F3F7F5] leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachments && (
              <div className="space-y-2">
                <h4 className="font-apple text-xs font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                  Attached Official Documents
                </h4>
                {selectedNotice.attachments.map((att) => (
                  <div
                    key={att.name}
                    className="p-3 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
                      <span className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{att.name}</span>
                      <span className="text-[10px] text-[#526059]">({att.size})</span>
                    </div>
                    <button
                      onClick={() => alert(`Simulating download of ${att.name}`)}
                      className="text-[#047857] dark:text-[#34D399] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="font-apple text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#047857] dark:text-[#34D399]" /> Publish Official Circular
            </h3>
            <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
              Issue an authorized notification to students, CRs, and faculty.
            </p>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Autumn Term Placement Workshops"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Notice['category'])}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                >
                  <option value="Academic">Academic</option>
                  <option value="Exams">Exams</option>
                  <option value="Placement">Placement</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Announcement Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed notice content..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857] resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-[#047857] focus:ring-[#047857]"
                />
                <label htmlFor="urgent" className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5]">
                  Mark as High Priority / Urgent Alert
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#526059]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
