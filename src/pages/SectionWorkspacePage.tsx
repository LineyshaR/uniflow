import React, { useState } from 'react';
import { 
  Users, MessageSquare, Download, Upload, 
  Send, FileText, Vote, Pin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SECTION_NOTES, SECTION_POLL } from '../data/mockData';
import { SectionNote, SectionPoll } from '../types';

export const SectionWorkspacePage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<SectionNote[]>(SECTION_NOTES);
  const [poll, setPoll] = useState<SectionPoll>(SECTION_POLL);
  const [selectedVote, setSelectedVote] = useState<string | null>(poll.userVotedId || null);

  const [discussions, setDiscussions] = useState([
    {
      id: 'd1',
      author: 'Ananya Sharma (CR)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      time: '2 hours ago',
      content: 'Reminder for Section 3A: Dr. Rao will inspect Lab 4 semaphores tomorrow at 9:00 AM in Systems Lab. Ensure your code compiles with gcc -pthread without warnings!',
      likes: 18,
      replies: 4
    },
    {
      id: 'd2',
      author: 'Kunal Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      time: '4 hours ago',
      content: 'Has anyone finished Question 3 on B-Tree index splitting for the DBMS assignment? The tree height calculation is ambiguous in case of odd order.',
      likes: 7,
      replies: 6
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Operating Systems (CS501)');

  const handleVote = (optionId: string) => {
    if (selectedVote === optionId) return;

    setPoll((prev) => {
      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === selectedVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      });
      return {
        ...prev,
        options: updatedOptions,
        totalVotes: selectedVote ? prev.totalVotes : prev.totalVotes + 1,
        userVotedId: optionId
      };
    });
    setSelectedVote(optionId);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: `d-${Date.now()}`,
      author: user?.name || 'Student',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      time: 'Just now',
      content: newPostContent.trim(),
      likes: 0,
      replies: 0
    };

    setDiscussions([newPost, ...discussions]);
    setNewPostContent('');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newNote: SectionNote = {
      id: `sn-${Date.now()}`,
      title: uploadTitle.trim(),
      subject: uploadSubject,
      uploadedBy: user?.name || 'Class Member',
      uploaderRole: user?.role === 'cr' ? 'Class Rep' : 'Student',
      date: 'Just now',
      downloads: 1,
      fileSize: '3.4 MB',
      fileType: 'PDF'
    };

    setNotes([newNote, ...notes]);
    setShowUploadModal(false);
    setUploadTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              SECTION CS-3A WORKSPACE
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">62 Enrolled Students • CKPCET</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Class Section Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            Class Representative Announcements • Shared Study Materials • Peer Doubt Clarification
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-xs font-semibold text-white shadow-xs self-start sm:self-auto transition-colors"
        >
          <Upload className="w-4 h-4 text-white" />
          <span>Share Study Material</span>
        </button>
      </div>

      {/* CR Announcement Pinned Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-full bg-[#047857] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Pin className="w-4 h-4 text-[#34D399]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-apple text-xs font-bold text-[#047857] dark:text-[#34D399]">
              CR Notice • Ananya Sharma
            </span>
            <span className="text-[10px] text-[#526059] dark:text-[#94A3B8]">• Posted Today, 08:30 AM</span>
          </div>
          <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1 leading-relaxed">
            "Hey Section 3A! For the DBMS mini-project review on Tuesday, please submit your ER diagrams and GitHub repos on the portal. Please also vote in the poll below regarding the weekend OS lab review with Dr. Rao."
          </p>
        </div>
      </div>

      {/* Grid: Poll & Shared Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shared Notes & Peer Discussion */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes & Study Resources */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
                Shared Notes, Handouts & Papers ({notes.length})
              </h3>
              <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Verified Peer Uploads</span>
            </div>

            <div className="space-y-2.5">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.03] dark:border-white/[0.06] hover:border-[#047857]/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2.5 py-1 rounded-md bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] font-mono text-xs font-semibold shrink-0">
                      {note.fileType}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-[#141B18] dark:text-[#F3F7F5] truncate">
                        {note.title}
                      </div>
                      <div className="text-[11px] text-[#526059] dark:text-[#94A3B8] flex items-center gap-2 mt-0.5">
                        <span>{note.subject}</span>
                        <span>•</span>
                        <span>By {note.uploadedBy}</span>
                        <span>•</span>
                        <span>{note.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Simulating download for: ${note.title} (${note.fileSize})`)}
                    className="p-2 rounded-full text-[#526059] hover:text-[#047857] hover:bg-black/[0.05] transition-colors shrink-0"
                    title="Download Note"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Discussion Feed */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
            <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              Class Discussion & Questions
            </h3>

            {/* Input to post */}
            <form onSubmit={handleCreatePost} className="space-y-2">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Ask a question to your section peers or share a helpful study tip..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#047857] text-[#141B18] dark:text-[#F3F7F5] resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#526059] dark:text-[#94A3B8]">Keep discussions respectful and academic.</span>
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-4 py-1.5 rounded-full bg-[#047857] hover:bg-[#065F46] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" /> Post to Section
                </button>
              </div>
            </form>

            {/* Feed items */}
            <div className="space-y-3 pt-2">
              {discussions.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={d.avatar} alt={d.author} className="w-7 h-7 rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/20" />
                      <div>
                        <div className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">{d.author}</div>
                        <div className="text-[10px] text-[#526059] dark:text-[#94A3B8]">{d.time}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#526059] dark:text-[#94A3B8] leading-relaxed">
                    {d.content}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#526059] dark:text-[#94A3B8] pt-1">
                    <button className="hover:text-[#047857] transition-colors">👍 {d.likes} Helpful</button>
                    <button className="hover:text-[#047857] transition-colors">💬 {d.replies} Replies</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Class Poll & Coordinators */}
        <div className="space-y-6">
          {/* Active Poll Widget */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-apple text-xs font-bold uppercase tracking-wider text-[#047857] dark:text-[#34D399] flex items-center gap-1.5">
                <Vote className="w-4 h-4 text-[#047857]" /> Section Poll
              </span>
              <span className="text-[10px] text-[#526059] dark:text-[#94A3B8]">{poll.deadline}</span>
            </div>

            <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-[#F3F7F5]">
              {poll.question}
            </h4>

            <div className="space-y-2">
              {poll.options.map((opt) => {
                const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                const isSelected = selectedVote === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-[#047857] bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] font-semibold'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[#047857]/40 bg-[#F6F8F6] dark:bg-[#0E281E]'
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#047857]/10 transition-all pointer-events-none"
                      style={{ width: `${percent}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span>{opt.text}</span>
                      <span className="font-mono font-bold text-[#047857] dark:text-white ml-2">
                        {percent}% ({opt.votes})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[#526059] dark:text-[#94A3B8] text-center pt-1">
              Total {poll.totalVotes} students voted • Click to cast vote
            </div>
          </div>

          {/* Coordinators */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-3">
            <h4 className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
              Section Coordinators
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  alt="CR"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/20"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">Ananya Sharma</div>
                  <div className="text-[10px] text-[#526059] dark:text-[#94A3B8]">Class Representative (CR)</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Faculty Advisor"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/20"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">Dr. Vikramaditya Rao</div>
                  <div className="text-[10px] text-[#526059] dark:text-[#94A3B8]">Faculty Academic Advisor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Study Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-apple text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#047857] dark:text-[#34D399]" /> Share Study Material
            </h3>
            <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
              Upload notes or solved problem sets for Section CS-3A.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OS Midsem Solved Questions (2025)"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Subject / Course
                </label>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                >
                  <option>Operating Systems (CS501)</option>
                  <option>Database Management Systems (CS502)</option>
                  <option>Design & Analysis of Algorithms (CS503)</option>
                  <option>Computer Networks (CS504)</option>
                  <option>Professional Ethics (HS501)</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-2xl text-center">
                <FileText className="w-8 h-8 mx-auto text-[#047857] mb-1" />
                <span className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block">
                  Select PDF or PPTX file
                </span>
                <span className="text-[10px] text-[#526059] dark:text-[#94A3B8]">Max size 25MB</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#526059]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold"
                >
                  Publish to Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
