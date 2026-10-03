export type UserRole = 'student' | 'cr' | 'faculty' | 'canteen_staff' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNo: string;
  department: string;
  semester: number;
  section: string;
  avatar: string;
  walletBalance: number;
  cgpa: number;
  attendanceOverall: number;
  hostelRoom?: string;
  phone: string;
  bio?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty: string;
  room: string;
  attendancePercentage: number;
  attendedClasses: number;
  totalClasses: number;
  gradeTarget?: string;
  currentInternalScore: number; // out of 50
  syllabusProgress: number; // percentage
  nextAssignment?: {
    title: string;
    dueDate: string;
    submitted: boolean;
  };
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  color: string;
}

export interface CanteenItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Meals' | 'Snacks' | 'Beverages' | 'Specials';
  price: number;
  isVeg: boolean;
  calories: number;
  prepTimeMinutes: number;
  available: boolean;
  rating: number;
  description: string;
  image: string;
  tags?: string[];
}

export interface CartItem {
  item: CanteenItem;
  quantity: number;
  specialInstructions?: string;
}

export interface CanteenOrder {
  id: string;
  tokenNumber: string;
  studentId: string;
  studentName: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Received' | 'Preparing' | 'Ready' | 'Picked Up';
  orderTime: string;
  estimatedPickupTime: string;
  counterNumber: string;
}

export interface QueueService {
  id: 'canteen' | 'registrar' | 'library' | 'clinic' | 'accounts';
  title: string;
  counterName: string;
  currentServing: number;
  totalWaiting: number;
  estimatedWaitMinutes: number;
  status: 'Open' | 'Crowded' | 'Break';
  icon: string;
}

export interface ActiveToken {
  id: string;
  serviceId: QueueService['id'];
  serviceName: string;
  tokenNumber: number;
  issuedAt: string;
  estimatedTime: string;
  status: 'Waiting' | 'Next' | 'Serving' | 'Completed' | 'Ready';
  counter: string;
}

export type UserToken = ActiveToken;

export interface ActiveQueueToken {
  id: string;
  serviceId: string;
  serviceName: string;
  tokenNumber: number;
  counter: string;
  estimatedTime: string;
  issuedAt?: string;
  status?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Exams' | 'Placement' | 'Sports' | 'Administrative' | 'Events';
  author: string;
  authorRole: string;
  date: string;
  isUrgent: boolean;
  isPinned?: boolean;
  departmentScope?: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  bannerImage: string;
  registeredCount: number;
  maxSeats: number;
  isRegistered?: boolean;
  ticketPrice?: number;
  tags: string[];
}

export interface StudentClub {
  id: string;
  name: string;
  category: 'Technical' | 'Arts & Music' | 'Literary' | 'Social & Welfare' | 'Sports';
  tagline: string;
  description: string;
  leadName: string;
  leadRole: string;
  membersCount: number;
  nextMeeting: string;
  isJoined?: boolean;
  avatar: string;
  banner: string;
  tags: string[];
}

export interface GrievanceComplaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: 'Hostel' | 'Mess/Food' | 'Academics' | 'Infrastructure' | 'Library' | 'IT & Wi-Fi';
  location: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Submitted' | 'In Progress' | 'Action Taken' | 'Resolved';
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
  resolutionRemark?: string;
}

export interface DocumentRequest {
  id: string;
  requestId: string;
  type: 'Bonafide Certificate' | 'Semester Grade Sheet' | 'Fee Receipt' | 'ID Card Re-issue' | 'No Objection Certificate (NOC)' | 'Hostel Clearance';
  purpose: string;
  status: 'Processing' | 'Ready for Download' | 'Pending Verification' | 'Rejected';
  requestDate: string;
  completionDate?: string;
  downloadUrl?: string;
  remarks?: string;
}

export interface SectionNote {
  id: string;
  title: string;
  subject: string;
  uploadedBy: string;
  uploaderRole: string;
  date: string;
  downloads: number;
  fileSize: string;
  fileType: 'PDF' | 'PPT' | 'ZIP' | 'DOC';
}

export interface SectionPoll {
  id: string;
  question: string;
  author: string;
  options: { id: string; text: string; votes: number }[];
  userVotedId?: string;
  totalVotes: number;
  deadline: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  assignedDate: string;
  dueDate: string;
  dueTime?: string;
  priority: 'Low' | 'Medium' | 'High';
  type: 'Lab Assignment' | 'Theory Homework' | 'Project Milestone' | 'Quiz Preparation' | 'Class Presentation';
  totalPoints: number;
  targetSection: string; // e.g. 'CS-3A' or 'All Sections'
  description: string;
  submissionsCount: number;
  totalStudents: number;
  status: 'Active' | 'Reviewing' | 'Closed';
  isCompletedByCurrentUser?: boolean;
  submittedStudents?: string[]; // Array of roll numbers who submitted
}

export interface StudentAcademicRecord {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  semester: number;
  section: string;
  avatar: string;
  attendanceOverall: number;
  cgpa: number;
  internalScore: number;
  submissionsCompleted: number;
  totalAssignments: number;
  attendanceRisk: boolean;
  phone?: string;
}
