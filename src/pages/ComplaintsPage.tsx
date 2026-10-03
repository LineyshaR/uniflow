import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Plus, Search, Filter, Clock, 
  MapPin, CheckCircle, AlertTriangle, MessageSquare, ChevronRight
} from 'lucide-react';
import { INITIAL_COMPLAINTS } from '../data/mockData';
import { GrievanceComplaint } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { subscribeComplaints, saveComplaint } from '../firebase/firestoreService';

export const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [complaints, setComplaints] = useState<GrievanceComplaint[]>(INITIAL_COMPLAINTS);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubscribe = subscribeComplaints((list) => {
      setComplaints(list);
    }, INITIAL_COMPLAINTS);
    return () => unsubscribe();
  }, []);

  // Lodge complaint modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GrievanceComplaint['category']>('Hostel');
  const [location, setLocation] = useState(user?.hostelRoom || 'Aryabhatta Hostel');
  const [priority, setPriority] = useState<GrievanceComplaint['priority']>('Medium');

  const filtered = complaints.filter((c) => {
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLodge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const randomNum = Math.floor(100 + Math.random() * 899);
    const newTicket: GrievanceComplaint = {
      id: `comp-${Date.now()}`,
      ticketNumber: `GRV-2026-${randomNum}`,
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      priority,
      status: 'Submitted',
      submittedBy: user?.name || 'Student',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now'
    };

    saveComplaint(newTicket);
    setComplaints([newTicket, ...complaints]);
    setShowModal(false);
    setTitle('');
    setDescription('');

    addNotification({
      title: `Grievance Lodged: ${newTicket.ticketNumber}`,
      message: `Your issue regarding ${category} has been routed to the maintenance warden.`,
      type: 'info',
      link: '/complaints'
    });
  };

  const getStatusBadge = (status: GrievanceComplaint['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'In Progress':
      case 'Action Taken':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold font-mono">
              CAMPUS WELFARE & GRIEVANCE REDRESSAL
            </span>
            <span className="text-xs text-slate-500">• 24/7 SLA Monitored</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            Grievances & Maintenance Desk
          </h1>
          <p className="text-xs text-slate-500">
            Submit hostel repair requests, mess quality feedback, and classroom facility issues
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge Grievance</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket #, room, or issue description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 dark:hover:border-rose-600 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {ticket.ticketNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {ticket.category}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    ticket.priority === 'High' || ticket.priority === 'Emergency'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                  Priority: {ticket.priority}
                </span>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${getStatusBadge(ticket.status)}`}>
                ● {ticket.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {ticket.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {ticket.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Lodged: {ticket.submittedAt}
              </span>
            </div>

            {ticket.resolutionRemark && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  Action Taken / Resolution Remark:
                </span>
                <span className="text-emerald-900 dark:text-emerald-200">
                  {ticket.resolutionRemark}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lodge Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Lodge Campus Grievance
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your ticket will be routed to the respective supervisor under university SLAs.
            </p>

            <form onSubmit={handleLodge} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Issue Summary / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water heater in Hostel B 2nd floor not functioning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GrievanceComplaint['category'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Hostel">Hostel & Accommodation</option>
                    <option value="Mess/Food">Mess / Canteen Food Quality</option>
                    <option value="Academics">Academic Labs / Classes</option>
                    <option value="Infrastructure">Campus Infrastructure</option>
                    <option value="IT & Wi-Fi">Campus Wi-Fi / Systems</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GrievanceComplaint['priority'])}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Low">Low (General suggestion)</option>
                    <option value="Medium">Medium (Affects daily tasks)</option>
                    <option value="High">High (Urgent attention needed)</option>
                    <option value="Emergency">Emergency (Immediate safety/leak)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Location (Hostel / Room / Block)
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain when this issue started, severity, and any actions tried..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
