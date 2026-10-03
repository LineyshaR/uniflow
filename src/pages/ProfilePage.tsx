import React, { useState } from 'react';
import { 
  UserCheck, Mail, Phone, MapPin, 
  ShieldCheck, QrCode, Edit3, Wallet, ChefHat,
  GraduationCap, Building2, Utensils, BookOpen, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { useCanteenCart } from '../context/CanteenCartContext';
import { ENROLLED_STUDENTS, INITIAL_TASKS } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { activeOrders } = useCanteenCart();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [hostelRoom, setHostelRoom] = useState(user?.hostelRoom || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone, bio, hostelRoom });
    setIsEditing(false);
  };

  const isChef = user?.role === 'canteen_staff';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student' || user?.role === 'cr';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
            {isChef ? (
              <ChefHat className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            ) : isFaculty ? (
              <Building2 className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            ) : (
              <UserCheck className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            )}
            <span>
              {isChef 
                ? 'Cafeteria Staff Identity & Kitchen Orders' 
                : isFaculty 
                ? 'Faculty Academic Credential & Handled Batches' 
                : 'Student Identity & Academic Records'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            {isChef
              ? 'Authorized Campus Hospitality & Kitchen Operations Supervisor'
              : isFaculty
              ? 'Official GTU Affiliated Professor & Laboratory In-charge Credential'
              : 'Official C.K. Pithawala Smart Identity Card • Academic Department & Contact Details'}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] self-start sm:self-auto transition-colors"
        >
          <Edit3 className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
          <span>{isEditing ? 'Cancel' : 'Edit Contact Info'}</span>
        </button>
      </div>

      {/* Digital Smart Identity Card in Rich Forest Emerald & Burnished Gold */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#062318] via-[#0A2E20] to-[#04120C] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#10B981]/20 blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <BrandLogo size="md" subtitle="C.K. Pithawala Engg. & Tech. • Smart ID" themeOverride="dark" />
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/30">
            {isChef ? 'KITCHEN AUTHORIZED' : isFaculty ? 'FACULTY TENURED' : 'ACTIVE ENROLLED'}
          </span>
        </div>

        {/* Card Body */}
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-28 h-32 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#062318]">
              ✓
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
            <div className="text-xs uppercase tracking-wider text-[#34D399] font-apple font-semibold">
              {user?.department}
            </div>
            <h2 className="font-apple text-2xl font-bold tracking-tight text-white">{user?.name}</h2>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/80">
              <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded-md font-bold text-[#FDE68A]">
                ID: {user?.rollNo}
              </span>

              {isStudent && (
                <>
                  <span>Semester {user?.semester} ({user?.section})</span>
                  <span>Hostel: {user?.hostelRoom || 'Day Scholar'}</span>
                </>
              )}

              {isFaculty && (
                <>
                  <span>Designation: Professor & Lab Head</span>
                  <span>Sections: CS-3A & CS-3B (64 Students)</span>
                </>
              )}

              {isChef && (
                <>
                  <span>Station: Food Court Counters 1 & 2</span>
                  <span>Safety Rating: A+ Certified</span>
                </>
              )}
            </div>

            <p className="text-xs text-white/70 pt-1 line-clamp-2">{user?.bio}</p>
          </div>

          {/* Barcode / QR Section */}
          <div className="p-3 bg-white rounded-2xl shrink-0 flex flex-col items-center justify-center shadow-sm">
            <QrCode className="w-20 h-20 text-[#062318]" />
            <span className="text-[9px] font-mono text-[#526059] mt-1 font-bold">{user?.rollNo}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/70 gap-2">
          <span>CKPCET Smart RFID Chip #884920-A</span>
          <span className="flex items-center gap-1 text-[#34D399] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" /> Authenticated by Office of the Registrar
          </span>
        </div>
      </div>

      {/* Role-Specific Metric Panels */}
      {isChef && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
              Chef's Orders Handled Summary
            </h3>
            <span className="text-xs text-[#047857] dark:text-[#34D399] font-bold">
              {activeOrders.length} Orders in Queue
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Total Orders Placed Today:</span>
              <div className="text-2xl font-bold font-apple text-[#141B18] dark:text-white mt-1">
                {activeOrders.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Orders Completed:</span>
              <div className="text-2xl font-bold font-apple text-[#047857] dark:text-[#34D399] mt-1">
                {activeOrders.filter(o => o.status === 'Picked Up').length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Daily Cafeteria Turnover:</span>
              <div className="text-2xl font-mono font-bold text-[#141B18] dark:text-white mt-1">
                ₹{activeOrders.reduce((sum, o) => sum + o.totalAmount, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFaculty && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
              Assigned Batches & Student Academic Data
            </h3>
            <span className="text-xs text-[#047857] dark:text-[#34D399] font-bold">
              64 Students in CS-3A
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Enrolled Undergraduates:</span>
              <div className="text-2xl font-bold font-apple text-[#141B18] dark:text-white mt-1">
                {ENROLLED_STUDENTS.length} Audited
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Attendance Risk Alerts (&lt;75%):</span>
              <div className="text-2xl font-bold font-apple text-rose-600 mt-1">
                {ENROLLED_STUDENTS.filter(s => s.attendanceRisk).length} Flagged
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Active Coursework Tasks:</span>
              <div className="text-2xl font-bold font-apple text-[#D97706] mt-1">
                {INITIAL_TASKS.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {isStudent && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
              Student Academic Overview (Private to You)
            </h3>
            <span className="text-xs text-[#047857] dark:text-[#34D399] font-bold">
              Eligible for GTU Exam
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Attendance Status:</span>
              <div className="text-2xl font-bold font-apple text-[#047857] dark:text-[#34D399] mt-1">
                {user?.attendanceOverall}%
              </div>
              <p className="text-[11px] text-[#047857] mt-0.5 font-semibold">Exceeds 75% rule</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Cumulative CGPA:</span>
              <div className="text-2xl font-bold font-apple text-[#141B18] dark:text-white mt-1">
                {user?.cgpa.toFixed(2)}
              </div>
              <p className="text-[11px] text-[#526059] mt-0.5">Scale of 10.0</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E]">
              <span className="text-[#526059] dark:text-[#94A3B8]">Cashless Smart Wallet:</span>
              <div className="text-2xl font-mono font-bold text-[#047857] dark:text-white mt-1">
                ₹{user?.walletBalance}
              </div>
              <p className="text-[11px] text-[#526059] mt-0.5">RFID Active</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-6">
        <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
          Contact & Residential Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Primary Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  {isStudent ? 'Hostel & Room Allotment' : 'Campus Office / Counter'}
                </label>
                <input
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                Profile Bio / Statement
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857] resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#526059] hover:bg-[#F6F8F6]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              <div>
                <span className="text-[#526059] dark:text-[#94A3B8] block text-[10px]">Mobile Contact</span>
                <span className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{user?.phone}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              <div>
                <span className="text-[#526059] dark:text-[#94A3B8] block text-[10px]">Institutional Email</span>
                <span className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{user?.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              <div>
                <span className="text-[#526059] dark:text-[#94A3B8] block text-[10px]">Location / Room</span>
                <span className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{user?.hostelRoom || 'Campus Building'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              <div>
                <span className="text-[#526059] dark:text-[#94A3B8] block text-[10px]">Institutional Status</span>
                <span className="font-semibold text-[#047857] dark:text-[#34D399]">Registered & Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
