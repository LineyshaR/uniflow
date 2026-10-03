import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Calendar, CheckCircle2, AlertCircle, 
  Utensils, ArrowUpRight, Sparkles, Layers, ShieldAlert, 
  FileText, TrendingUp, Users, ChevronRight, Award, Plus,
  Search, ChefHat, Check, Filter, Phone, Mail, GraduationCap,
  BookOpen, Eye, X, Send, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCanteenCart } from '../context/CanteenCartContext';
import { useNotifications } from '../context/NotificationContext';
import { NOTICES_DATA, EVENTS_DATA, INITIAL_TASKS, ENROLLED_STUDENTS } from '../data/mockData';
import { BrandLogo } from '../components/common/BrandLogo';
import { AcademicTask, StudentAcademicRecord, CanteenOrder } from '../types';
import { subscribeTasks, saveTask } from '../firebase/firestoreService';
import campusHero from '../assets/images/campus_hero_arch_1791016056430.jpg';
import confetti from 'canvas-confetti';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { activeOrders, updateOrderStatus } = useCanteenCart();
  const { addNotification } = useNotifications();

  // Tasks state
  const [tasks, setTasks] = useState<AcademicTask[]>(INITIAL_TASKS);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskSubmittedRecord, setTaskSubmittedRecord] = useState<Record<string, boolean>>({});

  // Add Task form state (Faculty only)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCourse, setTaskCourse] = useState('CS501 - Operating Systems & Concurrency');
  const [taskType, setTaskType] = useState<AcademicTask['type']>('Lab Assignment');
  const [taskSection, setTaskSection] = useState('CS-3A');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('11:59 PM');
  const [taskPoints, setTaskPoints] = useState(50);
  const [taskPriority, setTaskPriority] = useState<AcademicTask['priority']>('High');
  const [taskDesc, setTaskDesc] = useState('');

  // Chef Canteen Orders filter & search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Received' | 'Preparing' | 'Ready' | 'Picked Up'>('All');

  // Faculty Student Roster search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [attendanceRiskOnly, setAttendanceRiskOnly] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentAcademicRecord | null>(null);

  // Synchronize Tasks from Firestore
  useEffect(() => {
    const unsub = subscribeTasks((list) => {
      setTasks(list);
    }, INITIAL_TASKS);
    return () => unsub();
  }, []);

  const urgentNotice = NOTICES_DATA.find((n) => n.isUrgent);
  const nextEvent = EVENTS_DATA[0];

  // Faculty: Create & Add a Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate.trim()) return;

    const parts = taskCourse.split(' - ');
    const code = parts[0] || 'CS501';
    const name = parts[1] || 'Coursework';

    const newTask: AcademicTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      courseCode: code,
      courseName: name,
      facultyId: user?.id || 'usr_faculty_1',
      facultyName: user?.name || 'Dr. Vikramaditya Rao',
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      priority: taskPriority,
      type: taskType,
      totalPoints: Number(taskPoints),
      targetSection: taskSection,
      description: taskDesc.trim() || 'Please submit solution files and test cases before deadline.',
      submissionsCount: 0,
      totalStudents: 64,
      status: 'Active',
      submittedStudents: []
    };

    saveTask(newTask);
    setTasks([newTask, ...tasks]);
    setShowAddTaskModal(false);

    // Reset form
    setTaskTitle('');
    setTaskDesc('');
    setTaskDueDate('');

    addNotification({
      title: `Task Created: ${newTask.title}`,
      message: `Assigned to Section ${newTask.targetSection} for ${newTask.courseCode}.`,
      type: 'academic',
      link: '/academics'
    });
  };

  // Student: Submit / Mark Task Completed
  const handleSubmitTask = (taskId: string, title: string) => {
    setTaskSubmittedRecord((prev) => ({ ...prev, [taskId]: true }));
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, submissionsCount: t.submissionsCount + 1 } : t))
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    addNotification({
      title: `Task Submitted: ${title}`,
      message: 'Your assignment file and verification token were submitted to faculty.',
      type: 'academic',
      link: '/academics'
    });
  };

  // =========================================================================
  // VIEW 1: CANTEEN CHEF DASHBOARD (ONLY ORDERS PLACED)
  // =========================================================================
  if (user?.role === 'canteen_staff') {
    const filteredOrders = activeOrders.filter((ord) => {
      const matchesSearch = 
        ord.tokenNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.studentName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.items.some(i => i.item.name.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchesFilter = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
      return matchesSearch && matchesFilter;
    });

    const pendingOrdersCount = activeOrders.filter(o => o.status === 'Received' || o.status === 'Preparing').length;
    const readyOrdersCount = activeOrders.filter(o => o.status === 'Ready').length;
    const completedOrdersCount = activeOrders.filter(o => o.status === 'Picked Up').length;
    const totalTodayRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return (
      <div className="space-y-6">
        {/* Chef Kitchen Command Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#062318] via-[#0A2E20] to-[#04120C] text-white shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#10B981]/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] font-mono text-xs font-bold border border-[#10B981]/30">
                  KITCHEN OPERATIONS • LIVE ORDERS PLACED
                </span>
                <span className="text-xs text-white/70">• Food Court Counter 1 & 2</span>
              </div>
              <h1 className="font-apple text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <ChefHat className="w-8 h-8 text-[#34D399]" />
                Chef {user.name}'s Kitchen Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                Real-time cafeteria order management system • Process student tokens, update preparation state, and alert pickup counters.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/canteen"
                className="px-4 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Food Menu & Pricing</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Kitchen Real-Time KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
              Total Orders Placed
            </span>
            <div className="font-apple text-3xl font-bold text-[#141B18] dark:text-white mt-1">
              {activeOrders.length}
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">Active in queue today</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#D97706]">
              Preparing in Kitchen
            </span>
            <div className="font-apple text-3xl font-bold text-[#D97706] mt-1">
              {pendingOrdersCount}
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">On grill & stoves</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399]">
              Ready at Counter
            </span>
            <div className="font-apple text-3xl font-bold text-[#059669] dark:text-[#34D399] mt-1">
              {readyOrdersCount}
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">Waiting for student pickup</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
              Today's Food Revenue
            </span>
            <div className="font-mono text-3xl font-bold text-[#141B18] dark:text-white mt-1">
              ₹{totalTodayRevenue}
            </div>
            <p className="text-[11px] text-[#059669] dark:text-[#34D399] font-semibold mt-1">100% Cashless Wallet / UPI</p>
          </div>
        </div>

        {/* Orders Placed Master Section */}
        <div className="space-y-4">
          {/* Controls: Search & Status Filters */}
          <div className="p-4 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Token (e.g. A-42), student name, or item..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['All', 'Received', 'Preparing', 'Ready', 'Picked Up'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    orderStatusFilter === st
                      ? 'bg-[#047857] text-white shadow-2xs font-bold'
                      : 'bg-[#F6F8F6] dark:bg-[#0E281E] text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Placed Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isReady = order.status === 'Ready';
                const isPreparing = order.status === 'Preparing';
                const isReceived = order.status === 'Received';
                const isPickedUp = order.status === 'Picked Up';

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs hover:border-[#059669]/60 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl font-extrabold px-3 py-1.5 rounded-2xl bg-[#047857] text-white shadow-xs">
                            #{order.tokenNumber}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">
                              {order.studentName}
                            </div>
                            <div className="text-[11px] text-[#526059] dark:text-[#94A3B8]">
                              Placed at {order.orderTime} • {order.counterNumber}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
                              : isPreparing
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : isPickedUp
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          }`}
                        >
                          ● {order.status}
                        </span>
                      </div>

                      {/* Items Ordered */}
                      <div className="mt-3.5 space-y-2">
                        <span className="text-[10px] font-apple font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                          Items to Prepare:
                        </span>
                        <div className="p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] space-y-1.5 text-xs">
                          {order.items.map((i) => (
                            <div key={i.item.id} className="flex items-center justify-between text-[#141B18] dark:text-[#F3F7F5]">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <span className="font-semibold">{i.item.name}</span>
                              </div>
                              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#062318] border border-black/[0.06]">
                                Qty: {i.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions for Chef */}
                    <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
                      <div className="text-xs font-mono font-bold text-[#141B18] dark:text-white">
                        Total Paid: ₹{order.totalAmount}
                      </div>

                      <div className="flex items-center gap-2">
                        {isReceived && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Preparing')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Start Preparing
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Ready at Counter</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hand Over / Picked Up</span>
                          </button>
                        )}

                        {isPickedUp && (
                          <span className="text-xs text-slate-400 font-semibold px-2 py-1">
                            Order Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center p-8 bg-white dark:bg-[#0B1B14] rounded-3xl border border-[#047857]/20">
                <ChefHat className="w-10 h-10 mx-auto text-[#526059] opacity-40 mb-2" />
                <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-white">
                  No orders match current filter
                </h4>
                <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
                  Placed student orders will automatically appear in this live queue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FACULTY & TEACHER DASHBOARD (SHOW STUDENTS DATA & ADD A TASK)
  // =========================================================================
  if (user?.role === 'faculty') {
    const filteredStudents = ENROLLED_STUDENTS.filter((stud) => {
      const matchQuery = 
        stud.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        stud.rollNo.toLowerCase().includes(studentSearch.toLowerCase());
      const matchRisk = attendanceRiskOnly ? stud.attendanceRisk : true;
      return matchQuery && matchRisk;
    });

    const atRiskCount = ENROLLED_STUDENTS.filter(s => s.attendanceRisk).length;

    return (
      <div className="space-y-6">
        {/* Faculty Welcome Banner in Deep Emerald & Gold */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#062318] via-[#0A2E20] to-[#04120C] text-white shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#10B981]/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" subtitle="Faculty Portal" themeOverride="dark" />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] font-mono font-bold">
                  AUTUMN 2026 INSTRUCTOR CONSOLE
                </span>
              </div>
              <h1 className="font-apple text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                {user?.department} • Head of Distributed Systems Lab • Assigned Sections: <span className="font-mono font-bold text-white">CS-3A & CS-3B</span>
              </p>
            </div>

            {/* Exclusive "Add a Task" Action for Faculty */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add a Task / Assignment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Faculty Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
              Enrolled Students
            </span>
            <div className="font-apple text-3xl font-bold text-[#141B18] dark:text-white mt-1">
              64
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">Section CS-3A Roster</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399]">
              Class Avg Attendance
            </span>
            <div className="font-apple text-3xl font-bold text-[#059669] dark:text-[#34D399] mt-1">
              88.4%
            </div>
            <p className="text-[11px] text-[#059669] dark:text-[#34D399] mt-1">Healthy attendance compliance</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-rose-500">
              Attendance Alert (&lt;75%)
            </span>
            <div className="font-apple text-3xl font-bold text-rose-600 mt-1">
              {atRiskCount} Students
            </div>
            <p className="text-[11px] text-rose-500 font-semibold mt-1">Hall ticket disqualification risk</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <span className="text-xs font-apple font-bold uppercase tracking-wider text-[#D97706]">
              Active Coursework Tasks
            </span>
            <div className="font-apple text-3xl font-bold text-[#D97706] mt-1">
              {tasks.length}
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">Under ongoing evaluation</p>
          </div>
        </div>

        {/* Section 1: Enrolled Students Academic Data Table (Faculty Only) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
                Enrolled Students Academic Records & Attendance
              </h3>
              <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                Section CS-3A student performance audit, internal marks, and laboratory submission tracking.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAttendanceRiskOnly(!attendanceRiskOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  attendanceRiskOnly
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-[#F6F8F6] dark:bg-[#0E281E] text-[#526059] dark:text-[#94A3B8] hover:text-rose-600'
                }`}
              >
                {attendanceRiskOnly ? 'Showing <75% Risk Only' : 'Filter <75% Attendance'}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students by roll number (e.g. 23CS048) or name..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
            />
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-[#526059] dark:text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">CGPA</th>
                  <th className="py-2.5 px-3">Internal (50)</th>
                  <th className="py-2.5 px-3">Tasks Completed</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-black/[0.06]"
                        />
                        <div>
                          <div className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{s.name}</div>
                          <div className="text-[10px] text-[#526059] dark:text-[#94A3B8]">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#047857] dark:text-[#34D399]">
                      {s.rollNo}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                          s.attendanceRisk
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {s.attendanceOverall}% {s.attendanceRisk && '⚠️'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold font-mono">
                      {s.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {s.internalScore} / 50
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{s.submissionsCompleted} / {s.totalAssignments}</span>
                        <div className="w-16 bg-[#F6F8F6] dark:bg-[#0E281E] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#047857] h-full"
                            style={{ width: `${(s.submissionsCompleted / s.totalAssignments) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedStudentDetail(s)}
                        className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] hover:bg-[#047857] hover:text-white transition-colors text-[11px] font-semibold"
                      >
                        View Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Assigned Coursework & Tasks (Faculty View) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                Coursework Tasks Assigned by Faculty
              </h3>
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add a Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                      {task.courseCode} • {task.type}
                    </span>
                    <h4 className="text-sm font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1">
                      {task.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {task.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-[#526059] dark:text-[#94A3B8] line-clamp-2">
                  {task.description}
                </p>

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#526059] dark:text-[#94A3B8]">
                  <span>Due: <strong className="text-[#141B18] dark:text-white">{task.dueDate}</strong></span>
                  <span className="font-semibold text-[#047857] dark:text-[#34D399]">
                    {task.submissionsCount} / {task.totalStudents} Submissions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add a Task (Accessible to Faculty & Teachers ONLY) */}
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#047857] dark:text-[#34D399]">
                    Faculty Coursework Portal
                  </span>
                  <h3 className="text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] mt-0.5">
                    Add a Task / Assignment for Students
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-[#526059] hover:text-[#141B18] text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Task Title / Problem Statement
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab 5: Inter-Process Communication with Shared Memory"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Course Subject
                    </label>
                    <select
                      value={taskCourse}
                      onChange={(e) => setTaskCourse(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                    >
                      <option value="CS501 - Operating Systems & Concurrency">CS501 - Operating Systems</option>
                      <option value="CS502 - Database Management Systems">CS502 - Database Systems</option>
                      <option value="CS503 - Design & Analysis of Algorithms">CS503 - Algorithms</option>
                      <option value="CS504 - Computer Networks & Protocols">CS504 - Computer Networks</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Task Type
                    </label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as AcademicTask['type'])}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                    >
                      <option value="Lab Assignment">Lab Assignment</option>
                      <option value="Theory Homework">Theory Homework</option>
                      <option value="Project Milestone">Project Milestone</option>
                      <option value="Quiz Preparation">Quiz Preparation</option>
                      <option value="Class Presentation">Class Presentation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Target Section
                    </label>
                    <input
                      type="text"
                      value={taskSection}
                      onChange={(e) => setTaskSection(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oct 12, 2026"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                      Max Marks / Points
                    </label>
                    <input
                      type="number"
                      value={taskPoints}
                      onChange={(e) => setTaskPoints(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Submission Instructions & Guidelines
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide detailed instructions, expected deliverable formats (PDF/C files/Git repo), and grading rubrics..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md"
                  >
                    Publish Task to Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Individual Student Record */}
        {selectedStudentDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudentDetail.avatar}
                    alt={selectedStudentDetail.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#047857]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                      {selectedStudentDetail.name}
                    </h3>
                    <p className="text-xs font-mono text-[#047857] dark:text-[#34D399]">
                      Roll No: {selectedStudentDetail.rollNo} • {selectedStudentDetail.section}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentDetail(null)}
                  className="text-[#526059] hover:text-[#141B18] text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] text-xs">
                <div>
                  <span className="text-[#526059] dark:text-[#94A3B8]">Attendance:</span>
                  <div className={`font-bold text-sm ${selectedStudentDetail.attendanceRisk ? 'text-rose-600' : 'text-[#047857]'}`}>
                    {selectedStudentDetail.attendanceOverall}%
                  </div>
                </div>

                <div>
                  <span className="text-[#526059] dark:text-[#94A3B8]">Cumulative CGPA:</span>
                  <div className="font-bold text-sm text-[#141B18] dark:text-white">
                    {selectedStudentDetail.cgpa.toFixed(2)}
                  </div>
                </div>

                <div>
                  <span className="text-[#526059] dark:text-[#94A3B8]">Internal Score:</span>
                  <div className="font-bold text-sm text-[#141B18] dark:text-white">
                    {selectedStudentDetail.internalScore} / 50
                  </div>
                </div>

                <div>
                  <span className="text-[#526059] dark:text-[#94A3B8]">Tasks Completed:</span>
                  <div className="font-bold text-sm text-[#141B18] dark:text-white">
                    {selectedStudentDetail.submissionsCompleted} / {selectedStudentDetail.totalAssignments}
                  </div>
                </div>
              </div>

              {selectedStudentDetail.attendanceRisk && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Student is below mandatory 75% attendance threshold. Needs academic warning notice.</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedStudentDetail(null)}
                  className="flex-1 py-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Academic advisory alert sent to ${selectedStudentDetail.name} (${selectedStudentDetail.email})`);
                    setSelectedStudentDetail(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold"
                >
                  Send Academic Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: STUDENT DASHBOARD (STUDENT DETAILS TO STUDENTS ONLY)
  // =========================================================================
  // Students only see their own placed canteen orders
  const myActiveOrders = activeOrders.filter(
    (o) => o.studentId === user?.id || o.studentName.toLowerCase().includes(user?.name.toLowerCase() || '')
  );

  const quickShortcuts = [
    { name: 'Canteen Order', path: '/canteen', icon: Utensils, iconBg: 'bg-[#047857]/10 text-[#047857] dark:bg-[#062318] dark:text-[#34D399]' },
    { name: 'Queue Desks', path: '/queue', icon: Layers, iconBg: 'bg-[#D97706]/10 text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300' },
    { name: 'CS-3A Notes', path: '/section', icon: Users, iconBg: 'bg-[#047857]/10 text-[#047857] dark:bg-[#062318] dark:text-[#34D399]' },
    { name: 'Grievance Desk', path: '/complaints', icon: ShieldAlert, iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300' },
    { name: 'Document Portal', path: '/documents', icon: FileText, iconBg: 'bg-[#047857]/10 text-[#047857] dark:bg-[#062318] dark:text-[#34D399]' },
    { name: 'AI Advisor', path: '/ai', icon: Sparkles, iconBg: 'bg-[#D97706]/10 text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner in Rich Emerald & Gold (Apple Keynote Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062318] via-[#0A2E20] to-[#04120C] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url(${campusHero})` }}
        />
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-[#10B981]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <BrandLogo size="md" subtitle="Institutional Portal • Autumn 2026" themeOverride="dark" />
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                <span>Term Active</span>
              </div>
            </div>
            <h1 className="font-apple text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl font-normal">
              {user?.department} • Semester {user?.semester} ({user?.section}) • Roll No: <span className="font-mono text-white font-semibold">{user?.rollNo}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/timetable"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#047857] font-semibold text-xs hover:bg-[#F6F8F6] transition-all shadow-sm"
            >
              <Clock className="w-4 h-4 text-[#047857]" />
              <span>Today's Schedule</span>
            </Link>
            <Link
              to="/canteen"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold text-xs transition-all"
            >
              <Utensils className="w-4 h-4 text-[#34D399]" />
              <span>Order Food</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Urgent Notice Strip */}
      {urgentNotice && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#047857] text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-[#34D399]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-apple font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                  OFFICIAL CIRCULAR
                </span>
                <span className="text-xs text-[#526059] dark:text-[#94A3B8]">{urgentNotice.date}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#141B18] dark:text-[#F3F7F5] truncate mt-0.5">{urgentNotice.title}</p>
            </div>
          </div>
          <Link
            to="/notices"
            className="text-xs font-semibold text-[#047857] dark:text-[#34D399] hover:underline shrink-0 flex items-center gap-1"
          >
            <span>Read Circular</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Student Personal Metrics (Student Details to Students Only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-apple font-semibold uppercase tracking-wider text-[11px] text-[#526059] dark:text-[#94A3B8]">
              Overall Attendance
            </span>
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-apple text-2xl sm:text-3xl font-bold text-[#141B18] dark:text-white">
                {user?.attendanceOverall}%
              </span>
              <span className="text-[11px] font-semibold text-[#059669] dark:text-[#34D399]">
                Eligible (&gt;75%)
              </span>
            </div>
            <div className="w-full bg-[#F6F8F6] dark:bg-[#0E281E] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-[#047857] dark:bg-[#10B981] h-full rounded-full"
                style={{ width: `${user?.attendanceOverall}%` }}
              />
            </div>
          </div>
          <Link to="/academics" className="mt-3 text-[11px] text-[#047857] dark:text-[#34D399] font-semibold flex items-center gap-1 hover:underline">
            Course breakdown <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* CGPA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-apple font-semibold uppercase tracking-wider text-[11px] text-[#526059] dark:text-[#94A3B8]">
              Cumulative CGPA
            </span>
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-apple text-2xl sm:text-3xl font-bold text-[#141B18] dark:text-white">
                {user?.cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-[#526059] dark:text-[#94A3B8]">/ 10.0</span>
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">First Class with Distinction</p>
          </div>
          <Link to="/academics" className="mt-3 text-[11px] text-[#047857] dark:text-[#34D399] font-semibold flex items-center gap-1 hover:underline">
            CGPA simulator <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Smart Wallet */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-apple font-semibold uppercase tracking-wider text-[11px] text-[#526059] dark:text-[#94A3B8]">
              Smart Wallet
            </span>
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-3xl font-bold text-[#047857] dark:text-white">
              ₹{user?.walletBalance}
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">Tap & Pay Canteen / Library</p>
          </div>
          <Link to="/canteen" className="mt-3 text-[11px] text-[#047857] dark:text-[#34D399] font-semibold flex items-center gap-1 hover:underline">
            Order food now <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Assigned Coursework Count */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-apple font-semibold uppercase tracking-wider text-[11px] text-[#526059] dark:text-[#94A3B8]">
              Faculty Tasks
            </span>
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-apple text-2xl sm:text-3xl font-bold text-[#141B18] dark:text-white">
                {tasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[#D97706]">1 Due Tomorrow</span>
            </div>
            <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">{tasks[0]?.title || 'Coursework'}</p>
          </div>
          <Link to="/academics" className="mt-3 text-[11px] text-[#047857] dark:text-[#34D399] font-semibold flex items-center gap-1 hover:underline">
            View all tasks <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h3 className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
          Institutional Desks & Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickShortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.name}
                to={s.path}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 hover:border-[#047857] shadow-2xs flex items-center gap-3 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] group-hover:text-[#047857] truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-[#526059]">Open</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Student Tasks from Faculty & Personal Canteen Order */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Coursework Tasks Assigned by Faculty */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
                  Tasks Assigned by Faculty
                </h3>
                <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                  Assignments, laboratory exercises and project milestones for Section {user?.section || 'CS-3A'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#047857] dark:text-[#34D399]">
                {tasks.length} Assigned
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {tasks.map((task) => {
                const isDone = taskSubmittedRecord[task.id];

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                          {task.courseCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Due: {task.dueDate}
                        </span>
                        <span className="text-[10px] text-[#526059] dark:text-[#94A3B8]">
                          By {task.facultyName}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#141B18] dark:text-[#F3F7F5]">
                        {task.title}
                      </h4>
                      <p className="text-xs text-[#526059] dark:text-[#94A3B8] line-clamp-1">
                        {task.description}
                      </p>
                    </div>

                    <div className="shrink-0 self-end sm:self-auto">
                      {isDone ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Submitted</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubmitTask(task.id, task.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-2xs"
                        >
                          Submit Task
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Schedule Timeline */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#047857]" />
                Today's Lectures & Laboratories
              </h3>
              <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Monday Routine</span>
            </div>

            <div className="space-y-2.5">
              {[
                { time: '09:00 - 10:00 AM', code: 'CS501', name: 'Operating Systems', room: 'LH-201', status: 'Attended', color: 'bg-[#10B981]' },
                { time: '10:15 - 11:15 AM', code: 'CS502', name: 'DBMS Theory', room: 'LH-201', status: 'Up Next', color: 'bg-[#047857]' },
                { time: '11:30 - 01:00 PM', code: 'CS502L', name: 'DBMS Query Lab', room: 'CS Lab 3', status: 'Upcoming', color: 'bg-[#94A3B8]' },
                { time: '02:00 - 03:00 PM', code: 'CS503', name: 'Algorithms', room: 'LH-104', status: 'Upcoming', color: 'bg-[#94A3B8]' }
              ].map((c) => (
                <div
                  key={c.time}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.03] dark:border-white/[0.06] hover:border-[#047857]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${c.color}`} />
                    <div>
                      <div className="text-xs font-bold text-[#141B18] dark:text-[#F3F7F5]">
                        {c.name} <span className="font-mono font-normal text-[#526059]">({c.code})</span>
                      </div>
                      <div className="text-[11px] text-[#526059]">{c.time} • Room {c.room}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Attended'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : c.status === 'Up Next'
                        ? 'bg-[#047857] text-white'
                        : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#526059]'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Student's Personal Canteen Token & Flagship Fest */}
        <div className="space-y-6">
          {/* Active Personal Canteen Token */}
          {myActiveOrders.length > 0 ? (
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-apple text-xs font-bold uppercase tracking-wider text-[#047857] dark:text-[#34D399] flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#047857]" /> Your Cafeteria Token
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#047857] text-white">
                  Token #{myActiveOrders[0].tokenNumber}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04]">
                <div className="flex items-center justify-between text-xs font-bold text-[#141B18] dark:text-[#F3F7F5] mb-2">
                  <span>Preparation Status:</span>
                  <span className="text-[#047857] dark:text-[#34D399]">{myActiveOrders[0].status}</span>
                </div>

                <div className="w-full bg-black/[0.06] dark:bg-white/[0.1] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      myActiveOrders[0].status === 'Ready'
                        ? 'w-full bg-emerald-500'
                        : myActiveOrders[0].status === 'Preparing'
                        ? 'w-2/3 bg-[#D97706]'
                        : 'w-1/3 bg-[#047857]'
                    }`}
                  />
                </div>

                <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-2">
                  Counter: <span className="font-semibold text-[#141B18] dark:text-white">{myActiveOrders[0].counterNumber}</span>
                </p>

                <div className="mt-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] text-[11px] text-[#526059] dark:text-[#94A3B8]">
                  {myActiveOrders[0].items.map((i) => (
                    <div key={i.item.id} className="flex justify-between">
                      <span>{i.item.name} × {i.quantity}</span>
                      <span className="font-bold">₹{i.item.price * i.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/canteen"
                className="w-full block py-2 text-center rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                Track Live Order
              </Link>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center mb-3">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-white">Campus Food Court</h4>
              <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1 max-w-xs mx-auto">
                Order hot meals, dosas, thalis & coffee with your smart card balance.
              </p>
              <Link
                to="/canteen"
                className="mt-4 inline-block px-5 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-colors"
              >
                Open Food Menu
              </Link>
            </div>
          )}

          {/* Flagship Fest Card */}
          {nextEvent && (
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="font-apple text-xs font-bold uppercase tracking-wider text-[#047857] dark:text-[#34D399] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D97706]" /> Flagship Fest
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                  {nextEvent.category}
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden relative aspect-video mb-3">
                <img
                  src={nextEvent.bannerImage}
                  alt={nextEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="text-white">
                    <p className="text-xs font-bold leading-tight">{nextEvent.title}</p>
                    <p className="text-[10px] text-white/80">{nextEvent.date}</p>
                  </div>
                </div>
              </div>

              <Link
                to="/events"
                className="w-full block py-2 text-center rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#047857] hover:text-white text-xs font-semibold text-[#141B18] dark:text-white transition-colors"
              >
                Register & Get Pass
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
