import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, Calculator, 
  Download, ArrowUpRight, Check, Award, FileCheck,
  Plus, Users, AlertTriangle, CheckCircle2, Search, X
} from 'lucide-react';
import { INITIAL_COURSES, INITIAL_TASKS, ENROLLED_STUDENTS } from '../data/mockData';
import { Course, AcademicTask, StudentAcademicRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { subscribeTasks, saveTask } from '../firebase/firestoreService';
import confetti from 'canvas-confetti';

export const AcademicsPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [tasks, setTasks] = useState<AcademicTask[]>(INITIAL_TASKS);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, boolean>>({});

  // Faculty Add Task modal
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCourse, setTaskCourse] = useState('CS501 - Operating Systems');
  const [taskType, setTaskType] = useState<AcademicTask['type']>('Lab Assignment');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPoints, setTaskPoints] = useState(50);
  const [taskSection, setTaskSection] = useState('CS-3A');
  const [taskDesc, setTaskDesc] = useState('');

  // Faculty student roster filter
  const [activeTab, setActiveTab] = useState<'courses' | 'tasks' | 'students'>('courses');
  const [studentSearch, setStudentSearch] = useState('');

  // CGPA Simulator state
  const currentCgpa = user?.cgpa || 8.84;
  const completedCredits = 84;
  const semCredits = 20;
  const [targetSgpa, setTargetSgpa] = useState<number>(9.2);

  const predictedCgpa = (
    (currentCgpa * completedCredits + targetSgpa * semCredits) /
    (completedCredits + semCredits)
  ).toFixed(2);

  useEffect(() => {
    const unsub = subscribeTasks((list) => {
      setTasks(list);
    }, INITIAL_TASKS);
    return () => unsub();
  }, []);

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
      dueTime: '11:59 PM',
      priority: 'High',
      type: taskType,
      totalPoints: Number(taskPoints),
      targetSection: taskSection,
      description: taskDesc.trim() || 'Complete the assigned problems and upload verification archives.',
      submissionsCount: 0,
      totalStudents: 64,
      status: 'Active',
      submittedStudents: []
    };

    saveTask(newTask);
    setTasks([newTask, ...tasks]);
    setShowAddTaskModal(false);

    setTaskTitle('');
    setTaskDesc('');
    setTaskDueDate('');

    addNotification({
      title: `Task Added: ${newTask.title}`,
      message: `Assigned for Section ${newTask.targetSection} (${newTask.courseCode}).`,
      type: 'academic',
      link: '/academics'
    });
  };

  const handleSubmitTask = (taskId: string, title: string) => {
    setSubmittedTasks((prev) => ({ ...prev, [taskId]: true }));
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, submissionsCount: t.submissionsCount + 1 } : t))
    );

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    addNotification({
      title: `Task Submitted: ${title}`,
      message: 'Submitted to instructor evaluation repository.',
      type: 'academic',
      link: '/academics'
    });
  };

  const totalClasses = courses.reduce((acc, c) => acc + c.totalClasses, 0);
  const attendedClasses = courses.reduce((acc, c) => acc + c.attendedClasses, 0);
  const overallPercentage = ((attendedClasses / totalClasses) * 100).toFixed(1);

  const isFaculty = user?.role === 'faculty';

  const filteredStudents = ENROLLED_STUDENTS.filter(
    (s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Academics & Coursework Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            {isFaculty 
              ? 'Faculty Coursework Management • Student Academic Records & Task Assignments' 
              : 'C.K. Pithawala Engineering Curriculum • Attendance Audits & CGPA Simulator'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Option of Add a Task accessible to faculty and teachers ONLY */}
          {isFaculty && (
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add a Task (Faculty)</span>
            </button>
          )}

          <button 
            onClick={() => alert('Downloading official GTU & CKPCET Autumn 2026 Academic Syllabus PDF')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] transition-colors"
          >
            <Download className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
            <span>Syllabus PDF</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs (Courses, Tasks, and Students for Faculty) */}
      <div className="flex items-center gap-1 p-1 bg-[#F6F8F6] dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/15 w-fit">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'courses'
              ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs'
              : 'text-[#526059] dark:text-[#94A3B8]'
          }`}
        >
          Courses & Attendance
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs'
              : 'text-[#526059] dark:text-[#94A3B8]'
          }`}
        >
          <span>Coursework Tasks ({tasks.length})</span>
        </button>

        {isFaculty && (
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs'
                : 'text-[#526059] dark:text-[#94A3B8]'
            }`}
          >
            <span>Student Records ({ENROLLED_STUDENTS.length})</span>
          </button>
        )}
      </div>

      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Attendance Summary */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex items-center justify-between">
              <div>
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                  {isFaculty ? 'Class Attendance Average' : 'Total Attendance'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-apple text-3xl font-bold text-[#141B18] dark:text-white">
                    {isFaculty ? '88.4%' : `${overallPercentage}%`}
                  </span>
                  <span className="text-xs font-semibold text-[#047857] dark:text-[#34D399]">
                    {isFaculty ? '64 Students' : `${attendedClasses}/${totalClasses} Classes`}
                  </span>
                </div>
                <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">
                  Mandatory minimum: 75.0% for end-sem exams
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Current CGPA */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex items-center justify-between">
              <div>
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                  {isFaculty ? 'Semester 5 Average GPA' : 'Cumulative CGPA'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-apple text-3xl font-bold text-[#141B18] dark:text-white">
                    {isFaculty ? '8.42' : currentCgpa.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#526059] dark:text-[#94A3B8]">/ 10.0</span>
                </div>
                <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">
                  {isFaculty ? 'Class academic standing: High' : 'Semester 1-4 credits: 84 earned'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Semester Load */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex items-center justify-between">
              <div>
                <span className="font-apple text-xs font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                  Semester 5 Load
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-apple text-3xl font-bold text-[#141B18] dark:text-white">
                    20
                  </span>
                  <span className="text-xs text-[#526059] dark:text-[#94A3B8]">Credits Total</span>
                </div>
                <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1">
                  5 Theory Subjects • 3 Laboratories
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
              Enrolled Courses & Laboratory Modules (Autumn 2026)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const isAttendanceLow = course.attendancePercentage < 80;
                const isCritical = course.attendancePercentage < 75;

                return (
                  <div
                    key={course.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs hover:border-[#047857] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                              {course.code}
                            </span>
                            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">
                              {course.credits} Credits • {course.room}
                            </span>
                          </div>
                          <h4 className="font-apple text-base font-bold text-[#141B18] dark:text-white mt-1">
                            {course.name}
                          </h4>
                          <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-0.5">Faculty: {course.faculty}</p>
                        </div>

                        <div
                          className={`px-3 py-1.5 rounded-2xl text-right shrink-0 border ${
                            isCritical
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200'
                              : isAttendanceLow
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200'
                          }`}
                        >
                          <div className="font-apple text-base font-bold">{course.attendancePercentage}%</div>
                          <div className="text-[10px] font-medium">
                            {course.attendedClasses}/{course.totalClasses} Attended
                          </div>
                        </div>
                      </div>

                      {/* Progress & Internals */}
                      <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-[#526059] dark:text-[#94A3B8] mb-1">
                            <span>Syllabus Covered</span>
                            <span className="font-semibold text-[#141B18] dark:text-white">{course.syllabusProgress}%</span>
                          </div>
                          <div className="w-full bg-[#F6F8F6] dark:bg-[#0E281E] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#047857] dark:bg-[#10B981] h-full rounded-full"
                              style={{ width: `${course.syllabusProgress}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-[#526059] dark:text-[#94A3B8] mb-1">
                            <span>Internal Score</span>
                            <span className="font-semibold text-[#141B18] dark:text-white">
                              {course.currentInternalScore} / 50
                            </span>
                          </div>
                          <div className="w-full bg-[#F6F8F6] dark:bg-[#0E281E] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#D97706] h-full rounded-full"
                              style={{ width: `${(course.currentInternalScore / 50) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
                      <span className="text-[#526059] dark:text-[#94A3B8]">Target Grade: <span className="font-bold text-[#047857] dark:text-[#34D399]">{course.gradeTarget || 'A'}</span></span>
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="text-[#047857] dark:text-[#34D399] font-semibold hover:underline flex items-center gap-1"
                      >
                        View Modules <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CGPA Simulator Calculator Card in Emerald & Gold */}
          {!isFaculty && (
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#062318] via-[#0A2E20] to-[#04120C] text-white shadow-xl border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#34D399]">
                    <Calculator className="w-3.5 h-3.5 text-[#34D399]" /> Interactive Target Planner
                  </div>
                  <h3 className="font-apple text-xl font-bold">Predict Your Autumn 2026 CGPA</h3>
                  <p className="text-xs text-white/80">
                    Simulate how different Semester 5 SGPA outcomes will elevate your cumulative graduation score at CKPCET.
                  </p>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Simulated Sem 5 SGPA Target:</span>
                      <span className="font-mono font-bold text-[#34D399] text-sm">{targetSgpa.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.1"
                      value={targetSgpa}
                      onChange={(e) => setTargetSgpa(parseFloat(e.target.value))}
                      className="w-full accent-[#10B981]"
                    />
                    <div className="flex justify-between text-[10px] text-white/60 mt-1">
                      <span>6.0 SGPA</span>
                      <span>8.0 SGPA</span>
                      <span>10.0 SGPA (Distinction)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[220px]">
                  <span className="font-apple text-xs uppercase tracking-wider text-white/80 font-semibold">
                    Projected Final CGPA
                  </span>
                  <div className="font-apple text-4xl sm:text-5xl font-extrabold text-white my-2">
                    {predictedCgpa}
                  </div>
                  <span className="text-xs text-[#34D399] font-semibold block">
                    {parseFloat(predictedCgpa) >= 8.5 ? '⭐ First Class with Distinction' : 'First Class'}
                  </span>
                  <p className="text-[10px] text-white/60 mt-2">
                    Based on 84 past credits + 20 current credits
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coursework Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20">
            <div>
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                {isFaculty ? 'Manage Section Tasks & Problem Sets' : 'Assigned Academic Coursework & Problem Sets'}
              </h3>
              <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                {isFaculty 
                  ? 'Assign exercises to Section CS-3A students, audit submissions, and track deliverables.' 
                  : 'Submit laboratory write-ups, theory problem sets, and mini-project milestones before deadlines.'}
              </p>
            </div>

            {isFaculty && (
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add a Task</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const isDone = submittedTasks[task.id];

              return (
                <div
                  key={task.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                        {task.courseCode} • {task.type}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {task.priority} Priority
                      </span>
                    </div>

                    <h4 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5]">
                      {task.title}
                    </h4>

                    <p className="text-xs text-[#526059] dark:text-[#94A3B8] leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#526059] dark:text-[#94A3B8] pt-1">
                      <span>Target: <strong className="text-[#141B18] dark:text-white">Section {task.targetSection}</strong></span>
                      <span>•</span>
                      <span>Total Marks: <strong className="font-mono text-[#047857] dark:text-[#34D399]">{task.totalPoints}</strong></span>
                      <span>•</span>
                      <span>Assigned by: <strong>{task.facultyName}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-[#526059] dark:text-[#94A3B8] block text-[10px]">Submission Deadline</span>
                      <span className="font-bold text-[#141B18] dark:text-white">{task.dueDate}</span>
                    </div>

                    {isFaculty ? (
                      <span className="text-xs font-bold text-[#047857] dark:text-[#34D399] px-3 py-1 rounded-xl bg-[#ECFDF5] dark:bg-[#062318]">
                        {task.submissionsCount} / {task.totalStudents} Submitted
                      </span>
                    ) : isDone ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Work Submitted</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSubmitTask(task.id, task.title)}
                        className="px-4 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-2xs"
                      >
                        Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Student Records Tab (Faculty Only) */}
      {isFaculty && activeTab === 'students' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
                Enrolled Students Academic Audit & Risk Monitor
              </h3>
              <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                Student data accessible to teachers and professors for Section CS-3A.
              </p>
            </div>
            <span className="text-xs font-bold text-[#047857] dark:text-[#34D399]">
              {ENROLLED_STUDENTS.length} Audited Undergraduates
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#526059] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.08] text-[#526059] dark:text-[#94A3B8] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">CGPA</th>
                  <th className="py-2.5 px-3">Internal Score</th>
                  <th className="py-2.5 px-3">Submissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">{s.name}</div>
                          <div className="text-[10px] text-[#526059]">{s.email}</div>
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
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {s.attendanceOverall}% {s.attendanceRisk && '⚠️ Alert'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {s.cgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {s.internalScore} / 50
                    </td>
                    <td className="py-3 px-3">
                      {s.submissionsCompleted} / {s.totalAssignments} Completed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add a Task (Accessible to Faculty & Teachers ONLY) */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#047857] dark:text-[#34D399]">
                  Faculty Instruction Portal
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
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 6: Semaphores & Shared Memory Buffer in C"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Course Subject
                  </label>
                  <select
                    value={taskCourse}
                    onChange={(e) => setTaskCourse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                  >
                    <option value="CS501 - Operating Systems">CS501 - Operating Systems</option>
                    <option value="CS502 - Database Systems">CS502 - Database Systems</option>
                    <option value="CS503 - Algorithms">CS503 - Algorithms</option>
                    <option value="CS504 - Computer Networks">CS504 - Computer Networks</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as AcademicTask['type'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                  >
                    <option value="Lab Assignment">Lab Assignment</option>
                    <option value="Theory Homework">Theory Homework</option>
                    <option value="Project Milestone">Project Milestone</option>
                    <option value="Quiz Preparation">Quiz Preparation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Section
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
                    placeholder="e.g. Oct 15, 2026"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-[#F6F8F6] dark:bg-[#0E281E] text-xs text-[#141B18] dark:text-[#F3F7F5]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#141B18] dark:text-[#F3F7F5] block mb-1">
                    Points
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
                  Task Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the question requirements, deliverable format, and scoring criteria..."
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
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-semibold text-[#047857] dark:text-[#34D399]">
                  {selectedCourse.code} • {selectedCourse.credits} Credits
                </span>
                <h3 className="font-apple text-lg font-bold text-[#141B18] dark:text-[#F3F7F5] mt-0.5">
                  {selectedCourse.name}
                </h3>
                <p className="text-xs text-[#526059] dark:text-[#94A3B8]">Instructor: {selectedCourse.faculty}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-[#526059] hover:text-[#141B18] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="font-apple text-xs font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                Syllabus Modules (Autumn 2026)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center justify-between">
                  <span>Unit 1: Process Concurrency & IPC Mechanisms</span>
                  <span className="font-semibold text-[#047857] dark:text-[#34D399]">Completed ✓</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center justify-between">
                  <span>Unit 2: CPU Scheduling & Deadlock Avoidance</span>
                  <span className="font-semibold text-[#047857] dark:text-[#34D399]">Completed ✓</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center justify-between">
                  <span>Unit 3: Memory Management & Paging / Virtual Memory</span>
                  <span className="font-semibold text-[#D97706]">In Progress (75%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] flex items-center justify-between">
                  <span>Unit 4: File Systems & Distributed Storage</span>
                  <span className="font-semibold text-[#526059] dark:text-[#94A3B8]">Upcoming</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
