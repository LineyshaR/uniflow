import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Plus, CheckCircle, Clock, 
  AlertCircle, ShieldCheck, Printer, FileBadge, Lock,
  UserCheck, ArrowRight, UserPlus, LogIn, Sparkles
} from 'lucide-react';
import { INITIAL_DOCUMENTS } from '../data/mockData';
import { DocumentRequest, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { subscribeDocumentRequests, saveDocumentRequest } from '../firebase/firestoreService';

export const DocumentsPage: React.FC = () => {
  const { user, signInWithCredentials, signUp, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const [documents, setDocuments] = useState<DocumentRequest[]>(INITIAL_DOCUMENTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [authGateTab, setAuthGateTab] = useState<'signin' | 'signup'>('signin');

  // Auth gate form state
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign up fields in document portal
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regSem, setRegSem] = useState(5);

  const [docType, setDocType] = useState<DocumentRequest['type']>('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');
  const [urgentDelivery, setUrgentDelivery] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentRequest | null>(null);

  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubscribe = subscribeDocumentRequests((list) => {
      setDocuments(list);
    }, INITIAL_DOCUMENTS);
    return () => unsubscribe();
  }, []);

  const handleOpenRequest = () => {
    if (!isAuthenticated || !user) {
      setAuthGateTab('signin');
      setShowAuthGateModal(true);
      return;
    }
    setShowRequestModal(true);
  };

  const handleAuthGateSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authIdentifier.trim()) {
      setAuthError('Please enter your Roll No. or college email.');
      return;
    }
    const res = await signInWithCredentials(authIdentifier.trim(), authPassword);
    if (res.success) {
      setShowAuthGateModal(false);
      setShowRequestModal(true);
    } else {
      setAuthError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleAuthGateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regName.trim() || !regEmail.trim()) {
      setAuthError('Name and email are required to register.');
      return;
    }
    const res = await signUp({
      name: regName.trim(),
      email: regEmail.trim(),
      role: 'student',
      rollNo: regRoll.trim() || '23CS099',
      department: regDept,
      semester: Number(regSem),
      section: 'CS-3A'
    }, authPassword);

    if (res.success) {
      setShowAuthGateModal(false);
      setShowRequestModal(true);
    } else {
      setAuthError(res.error || 'Registration failed.');
    }
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    const reqId = `DOC-REQ-${Math.floor(4000 + Math.random() * 999)}`;
    const newDoc: DocumentRequest = {
      id: `doc-${Date.now()}`,
      requestId: reqId,
      type: docType,
      purpose: purpose.trim(),
      status: 'Processing',
      requestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      remarks: urgentDelivery 
        ? 'Priority clearance requested. Under Registrar verification.' 
        : 'Submitted for Registrar digital signature. Available within 24-48 hours.'
    };

    saveDocumentRequest(newDoc);
    setDocuments([newDoc, ...documents]);
    setShowRequestModal(false);
    setPurpose('');

    addNotification({
      title: `Document Requested: ${newDoc.type}`,
      message: `Your request (${newDoc.requestId}) is being processed by the Registrar office.`,
      type: 'info',
      link: '/documents'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-bold font-mono">
              E-GOVERNANCE & CERTIFICATION DESK
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• Digitally Signed by Registrar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Official Certificates & Document Portal
          </h1>
          <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
            Apply for Bonafide certificates, official transcripts, fee receipts, and internship NOCs
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setAuthGateTab('signin');
              setShowAuthGateModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] transition-colors"
          >
            <UserCheck className="w-4 h-4 text-[#D97706]" />
            <span>Verify / Switch Account</span>
          </button>

          <button
            onClick={handleOpenRequest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Document</span>
          </button>
        </div>
      </div>

      {/* Verified Student Identity Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#ECFDF5] via-[#F6F8F6] to-[#FFFBEB] dark:from-[#062318] dark:via-[#092E20] dark:to-[#07130E] border border-[#047857]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#047857] text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">
                {isAuthenticated && user ? user.name : 'Institutional Verification Required'}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#047857]/10 dark:bg-[#34D399]/20 text-[#047857] dark:text-[#34D399]">
                {isAuthenticated && user ? `Roll: ${user.rollNo}` : 'Sign In Required'}
              </span>
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8]">
              {isAuthenticated && user
                ? `${user.department} • Semester ${user.semester} (${user.section}) • Digitally Audited`
                : 'Users must sign in or register with verified college credentials before requesting certified documents.'}
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <button
            onClick={() => {
              setAuthGateTab('signin');
              setShowAuthGateModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-bold hover:bg-[#065F46] shrink-0 self-start sm:self-auto shadow-2xs"
          >
            Sign In / Sign Up
          </button>
        )}
      </div>

      {/* Grid of Documents */}
      <div className="space-y-4">
        {documents.map((doc) => {
          const isReady = doc.status === 'Ready for Download';

          return (
            <div
              key={doc.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-black/[0.08] dark:border-white/[0.1] shadow-2xs hover:border-[#047857]/40 dark:hover:border-[#34D399]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                    {doc.requestId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isReady
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    ● {doc.status}
                  </span>
                  <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Requested: {doc.requestDate}</span>
                </div>

                <h3 className="text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                  {doc.type}
                </h3>

                <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                  Purpose: <span className="font-medium text-[#141B18] dark:text-[#F3F7F5]">{doc.purpose}</span>
                </p>

                {doc.remarks && (
                  <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] pt-0.5">
                    {doc.remarks}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                {isReady ? (
                  <>
                    <button
                      onClick={() => setSelectedPreviewDoc(doc)}
                      className="px-3.5 py-2 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#EEF3F0] text-xs font-bold text-[#141B18] dark:text-[#F3F7F5] transition-colors flex items-center gap-1.5"
                    >
                      <FileBadge className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading official Registrar certified copy of ${doc.type} (${doc.requestId})`)}
                      className="px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[#D97706] font-semibold px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                    <Clock className="w-4 h-4" />
                    <span>Under Review</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Preview Modal */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#047857] dark:text-[#34D399] font-bold">
                  Official Digitally Sealed Document Preview
                </span>
                <h3 className="text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] mt-0.5">
                  {selectedPreviewDoc.type}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="text-[#526059] hover:text-[#141B18] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Certificate Template Box */}
            <div className="p-6 rounded-2xl bg-[#FFFBEB]/60 dark:bg-[#062318]/60 border-2 border-dashed border-[#D97706]/30 dark:border-[#34D399]/30 text-[#141B18] dark:text-[#F3F7F5] space-y-3 font-serif">
              <div className="text-center pb-2 border-b border-[#D97706]/20 dark:border-[#34D399]/20">
                <h4 className="font-bold text-sm tracking-wider uppercase text-[#047857] dark:text-[#34D399]">C.K. Pithawala College of Engineering & Technology</h4>
                <p className="text-[10px] text-[#526059] dark:text-[#94A3B8] font-sans">Office of the Academic Registrar • Ref: {selectedPreviewDoc.requestId}</p>
              </div>

              <div className="text-xs leading-relaxed space-y-2">
                <p>
                  This is to certify that <strong>{user?.name || 'Aarav Mehta'}</strong>, bearing Roll No. <strong>{user?.rollNo || '23CS048'}</strong>, is a registered bona fide student of the Bachelor of Technology in <strong>{user?.department || 'Computer Science & Engineering'}</strong> (Semester {user?.semester || 5}).
                </p>
                <p>
                  This official credential is generated upon student application for: <em>"{selectedPreviewDoc.purpose}"</em>.
                </p>
              </div>

              <div className="pt-4 flex justify-between items-end border-t border-[#D97706]/20 dark:border-[#34D399]/20 text-[10px] font-sans">
                <div>
                  <span className="text-[#047857] dark:text-[#34D399] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Digitally Signed
                  </span>
                  <span className="text-[#526059] dark:text-[#94A3B8]">Issued: {selectedPreviewDoc.requestDate}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#047857] dark:text-[#34D399]">Academic Registrar</div>
                  <div className="text-[#526059] dark:text-[#94A3B8]">Student Affairs Wing, CKPCET</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPreviewDoc(null)}
                className="px-4 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Downloading official signed PDF document');
                  setSelectedPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold shadow-md"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Gate Modal: Sign In & Sign Up for Document Portal */}
      {showAuthGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#047857] dark:text-[#34D399] font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Institutional Access Control
                </span>
                <h3 className="text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] mt-0.5">
                  Sign In / Sign Up for Document Portal
                </h3>
              </div>
              <button
                onClick={() => setShowAuthGateModal(false)}
                className="text-[#526059] hover:text-[#141B18] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
              Official university certificates require authenticated student identity for legal compliance with GTU.
            </p>

            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#F6F8F6] dark:bg-[#062318] rounded-2xl border border-black/[0.04]">
              <button
                type="button"
                onClick={() => {
                  setAuthGateTab('signin');
                  setAuthError(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                  authGateTab === 'signin'
                    ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs'
                    : 'text-[#526059]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthGateTab('signup');
                  setAuthError(null);
                }}
                className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                  authGateTab === 'signup'
                    ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs'
                    : 'text-[#526059]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authGateTab === 'signin' ? (
              <form onSubmit={handleAuthGateSignIn} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Student Roll No. or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23CS048 or student@ckpcet.ac.in"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate & Continue to Documents</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuthGateSignUp} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Full Legal Student Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 23CS048"
                      value={regRoll}
                      onChange={(e) => setRegRoll(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Semester
                    </label>
                    <select
                      value={regSem}
                      onChange={(e) => setRegSem(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@ckpcet.ac.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Apply for Documents</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#047857]" /> Request Official Document
            </h3>
            <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
              Applying as: <span className="font-semibold text-[#047857] dark:text-[#34D399]">{user?.name} ({user?.rollNo})</span>
            </p>

            <form onSubmit={handleRequest} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentRequest['type'])}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                >
                  <option value="Bonafide Certificate">Bonafide Certificate</option>
                  <option value="Semester Grade Sheet">Semester Grade Sheet (Transcripts)</option>
                  <option value="Fee Receipt">Tuition / Hostel Fee Receipt</option>
                  <option value="No Objection Certificate (NOC)">No Objection Certificate (NOC)</option>
                  <option value="ID Card Re-issue">Duplicate Campus Smart ID Card</option>
                  <option value="Hostel Clearance">Hostel Vacation / Clearance Certificate</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                  Purpose / Intended Institution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visa application / Summer Internship / Bank Education Loan"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#ECFDF5]/50 dark:bg-[#062318]/50 border border-[#047857]/20 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={urgentDelivery}
                  onChange={(e) => setUrgentDelivery(e.target.checked)}
                  className="rounded text-[#047857] focus:ring-[#047857]"
                />
                <label htmlFor="urgentFlag" className="text-xs text-[#141B18] dark:text-[#F3F7F5] cursor-pointer">
                  Request expedited 24-hour priority dispatch for visa / interview
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md"
                >
                  Submit Official Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
