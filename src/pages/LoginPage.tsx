import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Lock, Mail, Sparkles, User, 
  GraduationCap, Building2, UtensilsCrossed, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import campusHero from '../assets/images/campus_hero_arch_1791016056430.jpg';

export const LoginPage: React.FC = () => {
  const { loginAs, loginWithGoogle, signInWithCredentials, signUp } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up Form State
  const [signUpRole, setSignUpRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollOrEmpId, setRollOrEmpId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(5);
  const [section, setSection] = useState('CS-3A');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);

  const demoAccounts: {
    role: UserRole;
    name: string;
    label: string;
    desc: string;
    avatar: string;
  }[] = [
    {
      role: 'student',
      name: 'Aarav Mehta',
      label: 'Student (CSE 3rd Year)',
      desc: 'Attendance 88.5% • Wallet ₹840 • Course Roster',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    {
      role: 'cr',
      name: 'Ananya Sharma',
      label: 'Class Representative (CR)',
      desc: 'Section CS-3A admin • Broadcast bulletin & poll owner',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    {
      role: 'faculty',
      name: 'Dr. Vikramaditya Rao',
      label: 'Faculty & Lab Head',
      desc: 'Coursework assignments, student records & lab supervisor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      role: 'canteen_staff',
      name: 'Chef Rameshwar Singh',
      label: 'Canteen Kitchen Supervisor',
      desc: 'Dedicated orders placed dashboard & live token queue',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=150'
    },
    {
      role: 'admin',
      name: 'Dean Mukherjee',
      label: 'Associate Dean of Affairs',
      desc: 'Governance oversight, circulars & grievance audit',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    loginAs(role);
    navigate('/');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    if (!signInIdentifier.trim()) {
      setSignInError('Please enter your college email or Roll No.');
      return;
    }

    const res = await signInWithCredentials(signInIdentifier.trim(), signInPassword);
    if (res.success) {
      navigate('/');
    } else {
      setSignInError(res.error || 'Failed to sign in.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccess(null);

    if (!fullName.trim() || !email.trim()) {
      setSignUpError('Please provide your full name and institutional email.');
      return;
    }

    const res = await signUp({
      name: fullName.trim(),
      email: email.trim(),
      role: signUpRole,
      rollNo: rollOrEmpId.trim() || (signUpRole === 'student' ? '23CS099' : 'FAC-100'),
      department,
      semester: signUpRole === 'student' ? Number(semester) : 0,
      section: signUpRole === 'student' ? section : 'Administration',
    }, signUpPassword);

    if (res.success) {
      setSignUpSuccess('Official profile registered successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } else {
      setSignUpError(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#07130E] text-[#141B18] dark:text-[#F3F7F5] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background subtle architectural texture & rich emerald glow */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-cover bg-center pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: `url(${campusHero})` }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#059669]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10 my-4">
        {/* Brand Lockup with Provided College Emblem next to UniFlow */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <BrandLogo size="lg" subtitle="C.K. Pithawala College of Engineering & Technology" />
          </div>
          <p className="text-xs text-[#526059] dark:text-[#94A3B8] max-w-sm mx-auto font-normal">
            Unified Campus Life & Academic Governance Portal • Surat, Gujarat
          </p>
        </div>

        {/* Main Card (Apple Card Style with Rich Emerald & Gold Accents) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/15 dark:border-white/[0.1] shadow-2xl space-y-5">
          {/* Sign In vs Sign Up Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F0F4F1] dark:bg-[#062318] rounded-2xl border border-[#047857]/10">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setSignInError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signin'
                  ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-sm'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              Sign In to UniFlow
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setSignUpError(null);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-sm'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              Sign Up / Register New User
            </button>
          </div>

          {authMode === 'signin' ? (
            /* ================= SIGN IN TAB ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#047857] dark:text-[#34D399] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D97706]" /> Instant Persona Login
                </span>
                <span className="text-[11px] text-[#526059] dark:text-[#94A3B8]">1-Click Access</span>
              </div>

              {/* Persona buttons */}
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleRoleSelect(account.role)}
                    className="w-full p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#EEF3F0] dark:hover:bg-[#123628] border border-black/[0.04] dark:border-white/[0.06] hover:border-[#059669]/40 transition-all text-left flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-[#141B18] dark:text-[#F3F7F5] group-hover:text-[#059669] truncate">
                            {account.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                            {account.label.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] truncate mt-0.5">{account.desc}</p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0B1B14] flex items-center justify-center text-[#526059] group-hover:text-[#059669] group-hover:bg-[#ECFDF5] transition-colors shrink-0 shadow-2xs">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative my-4 text-center">
                <span className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-black/[0.06] dark:border-white/[0.08]"></span>
                </span>
                <span className="relative bg-white dark:bg-[#0B1B14] px-3 text-[11px] font-apple font-semibold text-[#526059] dark:text-[#94A3B8] uppercase tracking-wider">
                  Or Sign In with Official Credentials
                </span>
              </div>

              {/* Firebase Google SSO Button */}
              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  navigate('/');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#EEF3F0] dark:hover:bg-[#123628] border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] transition-all flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.29 21.39 7.37 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.43l4.02-3.14z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.61 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>Sign In with CKPCET Google Account</span>
              </button>

              {/* Institutional Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-3">
                {signInError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Roll No. or college email (e.g. 23CS048@ckpcet.ac.in)"
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Institutional Password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Sign In to UniFlow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* ================= SIGN UP TAB ================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="pb-1 border-b border-black/[0.06] dark:border-white/[0.08]">
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#047857] dark:text-[#34D399] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#D97706]" /> New User Registration
                </span>
                <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-0.5">
                  Create your unified campus credential for academics, canteen & document services.
                </p>
              </div>

              {signUpError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {signUpSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{signUpSuccess}</span>
                </div>
              )}

              {/* Role Selector Pills */}
              <div>
                <label className="text-[11px] font-apple font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8] block mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('student')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      signUpRole === 'student'
                        ? 'bg-[#047857] text-white border-[#047857] shadow-sm'
                        : 'border-black/[0.08] dark:border-white/[0.1] text-[#526059] dark:text-[#94A3B8] hover:bg-[#F6F8F6]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('faculty')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      signUpRole === 'faculty'
                        ? 'bg-[#047857] text-white border-[#047857] shadow-sm'
                        : 'border-black/[0.08] dark:border-white/[0.1] text-[#526059] dark:text-[#94A3B8] hover:bg-[#F6F8F6]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignUpRole('canteen_staff')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      signUpRole === 'canteen_staff'
                        ? 'bg-[#047857] text-white border-[#047857] shadow-sm'
                        : 'border-black/[0.08] dark:border-white/[0.1] text-[#526059] dark:text-[#94A3B8] hover:bg-[#F6F8F6]'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Canteen Chef</span>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      {signUpRole === 'student' ? 'Student Roll No.' : signUpRole === 'faculty' ? 'Faculty ID' : 'Staff Code'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={signUpRole === 'student' ? 'e.g. 23CS092' : signUpRole === 'faculty' ? 'e.g. FAC-412' : 'STAFF-02'}
                      value={rollOrEmpId}
                      onChange={(e) => setRollOrEmpId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@ckpcet.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>

                {signUpRole === 'student' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                        Semester
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                        Section / Batch
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CS-3A"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Campus Hospitality">Campus Hospitality (Canteen)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Register & Enter UniFlow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Security watermark */}
        <div className="text-center text-[11px] text-[#526059] dark:text-[#94A3B8] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Affiliated with Gujarat Technological University (GTU) • Secured SSL</span>
        </div>
      </div>
    </div>
  );
};
