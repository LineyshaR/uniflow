import { 
  UserProfile, Course, TimetableSlot, CanteenItem, 
  QueueService, Notice, CampusEvent, StudentClub, 
  GrievanceComplaint, DocumentRequest, SectionNote, SectionPoll, CanteenOrder,
  AcademicTask, StudentAcademicRecord
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_1',
    name: 'Aarav Mehta',
    email: 'aarav.m@campus.edu',
    role: 'student',
    rollNo: '23CS048',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    walletBalance: 840,
    cgpa: 8.84,
    attendanceOverall: 88.5,
    hostelRoom: 'Aryabhatta Hall, Room 314',
    phone: '+91 98765 43210',
    bio: 'Junior CSE undergrad • Full-stack developer • President at GDG Campus'
  },
  cr: {
    id: 'usr_cr_1',
    name: 'Ananya Sharma',
    email: 'ananya.s@campus.edu',
    role: 'cr',
    rollNo: '23CS012',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    walletBalance: 1250,
    cgpa: 9.32,
    attendanceOverall: 94.0,
    hostelRoom: 'Gargi Hostel, Room 108',
    phone: '+91 98111 22334',
    bio: 'Class Representative (Section CS-3A) • Point of contact for academic coordination'
  },
  faculty: {
    id: 'usr_faculty_1',
    name: 'Dr. Vikramaditya Rao',
    email: 'dr.rao@campus.edu',
    role: 'faculty',
    rollNo: 'FAC-809',
    department: 'Computer Science & Engineering',
    semester: 0,
    section: 'CS-3A / CS-3B',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    walletBalance: 4500,
    cgpa: 0,
    attendanceOverall: 100,
    phone: '+91 98222 33445',
    bio: 'Professor & Head of Distributed Systems Lab • Advisor for ACM Student Chapter'
  },
  canteen_staff: {
    id: 'usr_canteen_1',
    name: 'Chef Rameshwar Singh',
    email: 'canteen.desk@campus.edu',
    role: 'canteen_staff',
    rollNo: 'STAFF-CN02',
    department: 'Campus Hospitality',
    semester: 0,
    section: 'Central Canteen',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=250',
    walletBalance: 320,
    cgpa: 0,
    attendanceOverall: 99,
    phone: '+91 98333 44556',
    bio: 'Head Supervisor, Main Food Court & Cafeteria counter'
  },
  admin: {
    id: 'usr_admin_1',
    name: 'Dean R. K. Mukherjee',
    email: 'dean.academic@campus.edu',
    role: 'admin',
    rollNo: 'ADMIN-001',
    department: 'Office of Academic Affairs',
    semester: 0,
    section: 'Administration Block',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    walletBalance: 5000,
    cgpa: 0,
    attendanceOverall: 100,
    phone: '+91 98000 11223',
    bio: 'Associate Dean of Student Affairs & Campus Welfare'
  }
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'CS501',
    name: 'Operating Systems & Concurrency',
    credits: 4,
    faculty: 'Dr. Vikramaditya Rao',
    room: 'Hall LH-201',
    attendancePercentage: 92.3,
    attendedClasses: 24,
    totalClasses: 26,
    gradeTarget: 'A+',
    currentInternalScore: 46,
    syllabusProgress: 75,
    nextAssignment: {
      title: 'Lab 4: Multi-threaded Producer Consumer with Semaphores',
      dueDate: 'Tomorrow, 11:59 PM',
      submitted: false
    }
  },
  {
    id: 'c2',
    code: 'CS502',
    name: 'Database Management Systems',
    credits: 4,
    faculty: 'Prof. Sunita Deshmukh',
    room: 'CS Lab 3',
    attendancePercentage: 87.5,
    attendedClasses: 21,
    totalClasses: 24,
    gradeTarget: 'A',
    currentInternalScore: 42,
    syllabusProgress: 80,
    nextAssignment: {
      title: 'ER Modeling and SQL Query Optimization Case Study',
      dueDate: 'Oct 08, 2026',
      submitted: true
    }
  },
  {
    id: 'c3',
    code: 'CS503',
    name: 'Design and Analysis of Algorithms',
    credits: 4,
    faculty: 'Dr. K. N. Raman',
    room: 'Hall LH-104',
    attendancePercentage: 81.8,
    attendedClasses: 18,
    totalClasses: 22,
    gradeTarget: 'A',
    currentInternalScore: 39,
    syllabusProgress: 68,
    nextAssignment: {
      title: 'Dynamic Programming: Knapsack & Matrix Chain Multiplication',
      dueDate: 'Oct 12, 2026',
      submitted: false
    }
  },
  {
    id: 'c4',
    code: 'CS504',
    name: 'Computer Networks & Protocols',
    credits: 3,
    faculty: 'Dr. Arindam Bose',
    room: 'Hall LH-205',
    attendancePercentage: 95.0,
    attendedClasses: 19,
    totalClasses: 20,
    gradeTarget: 'A+',
    currentInternalScore: 48,
    syllabusProgress: 85,
    nextAssignment: {
      title: 'Wireshark TCP Handshake and Packet Analysis Report',
      dueDate: 'Oct 15, 2026',
      submitted: false
    }
  },
  {
    id: 'c5',
    code: 'HS501',
    name: 'Professional Ethics & Intellectual Property',
    credits: 2,
    faculty: 'Prof. Meenakshi Iyer',
    room: 'Sem Hall B',
    attendancePercentage: 76.5,
    attendedClasses: 13,
    totalClasses: 17,
    gradeTarget: 'B+',
    currentInternalScore: 34,
    syllabusProgress: 60
  }
];

export const TIMETABLE_DATA: TimetableSlot[] = [
  // Monday
  { id: 'tt1', day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM', courseCode: 'CS501', courseName: 'Operating Systems', faculty: 'Dr. Rao', room: 'LH-201', type: 'Lecture', color: 'indigo' },
  { id: 'tt2', day: 'Monday', startTime: '10:15 AM', endTime: '11:15 AM', courseCode: 'CS502', courseName: 'DBMS Theory', faculty: 'Prof. Sunita', room: 'LH-201', type: 'Lecture', color: 'emerald' },
  { id: 'tt3', day: 'Monday', startTime: '11:30 AM', endTime: '01:00 PM', courseCode: 'CS502L', courseName: 'DBMS Query Lab', faculty: 'Prof. Sunita', room: 'CS Lab 3', type: 'Lab', color: 'emerald' },
  { id: 'tt4', day: 'Monday', startTime: '02:00 PM', endTime: '03:00 PM', courseCode: 'CS503', courseName: 'Algorithms', faculty: 'Dr. Raman', room: 'LH-104', type: 'Lecture', color: 'amber' },

  // Tuesday
  { id: 'tt5', day: 'Tuesday', startTime: '09:00 AM', endTime: '10:00 AM', courseCode: 'CS504', courseName: 'Computer Networks', faculty: 'Dr. Bose', room: 'LH-205', type: 'Lecture', color: 'sky' },
  { id: 'tt6', day: 'Tuesday', startTime: '10:15 AM', endTime: '11:15 AM', courseCode: 'CS501', courseName: 'Operating Systems', faculty: 'Dr. Rao', room: 'LH-201', type: 'Lecture', color: 'indigo' },
  { id: 'tt7', day: 'Tuesday', startTime: '11:30 AM', endTime: '01:00 PM', courseCode: 'CS501L', courseName: 'OS Kernel Lab', faculty: 'Dr. Rao', room: 'Systems Lab', type: 'Lab', color: 'indigo' },
  { id: 'tt8', day: 'Tuesday', startTime: '03:15 PM', endTime: '04:15 PM', courseCode: 'HS501', courseName: 'Ethics & IPR', faculty: 'Prof. Iyer', room: 'Sem Hall B', type: 'Lecture', color: 'purple' },

  // Wednesday
  { id: 'tt9', day: 'Wednesday', startTime: '09:00 AM', endTime: '10:00 AM', courseCode: 'CS503', courseName: 'Algorithms Tutorial', faculty: 'Dr. Raman', room: 'LH-104', type: 'Tutorial', color: 'amber' },
  { id: 'tt10', day: 'Wednesday', startTime: '10:15 AM', endTime: '11:15 AM', courseCode: 'CS504', courseName: 'Computer Networks', faculty: 'Dr. Bose', room: 'LH-205', type: 'Lecture', color: 'sky' },
  { id: 'tt11', day: 'Wednesday', startTime: '02:00 PM', endTime: '04:00 PM', courseCode: 'CS504L', courseName: 'Networks Socket Lab', faculty: 'Dr. Bose', room: 'Networking Lab', type: 'Lab', color: 'sky' },

  // Thursday
  { id: 'tt12', day: 'Thursday', startTime: '09:00 AM', endTime: '10:00 AM', courseCode: 'CS501', courseName: 'Operating Systems', faculty: 'Dr. Rao', room: 'LH-201', type: 'Lecture', color: 'indigo' },
  { id: 'tt13', day: 'Thursday', startTime: '10:15 AM', endTime: '11:15 AM', courseCode: 'CS502', courseName: 'DBMS Theory', faculty: 'Prof. Sunita', room: 'LH-201', type: 'Lecture', color: 'emerald' },
  { id: 'tt14', day: 'Thursday', startTime: '11:30 AM', endTime: '12:30 PM', courseCode: 'HS501', courseName: 'Ethics Seminar', faculty: 'Prof. Iyer', room: 'Sem Hall B', type: 'Lecture', color: 'purple' },
  { id: 'tt15', day: 'Thursday', startTime: '02:00 PM', endTime: '03:30 PM', courseCode: 'PROJECT', courseName: 'Capstone Project Review', faculty: 'Advisory Panel', room: 'Incubation Lab', type: 'Lab', color: 'rose' },

  // Friday
  { id: 'tt16', day: 'Friday', startTime: '09:00 AM', endTime: '10:00 AM', courseCode: 'CS503', courseName: 'Algorithms', faculty: 'Dr. Raman', room: 'LH-104', type: 'Lecture', color: 'amber' },
  { id: 'tt17', day: 'Friday', startTime: '10:15 AM', endTime: '11:15 AM', courseCode: 'CS504', courseName: 'Computer Networks', faculty: 'Dr. Bose', room: 'LH-205', type: 'Lecture', color: 'sky' },
  { id: 'tt18', day: 'Friday', startTime: '02:00 PM', endTime: '03:30 PM', courseCode: 'CLUB', courseName: 'Student Club / Activity Hour', faculty: 'Dean Affairs', room: 'Student Center', type: 'Tutorial', color: 'violet' }
];

export const CANTEEN_ITEMS: CanteenItem[] = [
  {
    id: 'f1',
    name: 'Masala Dosa with Sambar & Chutneys',
    category: 'Breakfast',
    price: 65,
    isVeg: true,
    calories: 320,
    prepTimeMinutes: 7,
    available: true,
    rating: 4.8,
    description: 'Crispy fermented crepe filled with spiced potato mash, served piping hot with 2 chutneys.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=400',
    tags: ['Bestseller', 'South Indian']
  },
  {
    id: 'f2',
    name: 'Paneer Butter Masala Thali',
    category: 'Meals',
    price: 130,
    isVeg: true,
    calories: 640,
    prepTimeMinutes: 10,
    available: true,
    rating: 4.9,
    description: 'Rich creamy paneer gravy, 3 fresh butter rotis, aromatic jeera rice, dal tadka, salad and gulab jamun.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=400',
    tags: ['Full Meal', 'Chef Special']
  },
  {
    id: 'f3',
    name: 'Crispy Veg Burger & Peri-Peri Fries',
    category: 'Snacks',
    price: 90,
    isVeg: true,
    calories: 480,
    prepTimeMinutes: 8,
    available: true,
    rating: 4.6,
    description: 'Crispy herb potato patty, secret chipotle mayo, fresh lettuce, tomatoes, served with seasoned fries.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400',
    tags: ['Quick Bite', 'Popular']
  },
  {
    id: 'f4',
    name: 'Cold Coffee with Choco Fudge',
    category: 'Beverages',
    price: 55,
    isVeg: true,
    calories: 210,
    prepTimeMinutes: 3,
    available: true,
    rating: 4.9,
    description: 'Frothy thick blended espresso coffee topped with chocolate drizzle and cocoa dust.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400',
    tags: ['Chilled', 'Study Fuel']
  },
  {
    id: 'f5',
    name: 'Grilled Chicken Sub Sandwich',
    category: 'Snacks',
    price: 110,
    isVeg: false,
    calories: 420,
    prepTimeMinutes: 9,
    available: true,
    rating: 4.7,
    description: 'Tender marinated chicken breast, melted mozzarella, jalapeños, and honey mustard on toasted baguette.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    tags: ['High Protein']
  },
  {
    id: 'f6',
    name: 'Szechuan Veg Hakka Noodles',
    category: 'Meals',
    price: 85,
    isVeg: true,
    calories: 390,
    prepTimeMinutes: 8,
    available: true,
    rating: 4.5,
    description: 'Wok-tossed noodles with bell peppers, shredded cabbage, spring onions in spicy red chili garlic sauce.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400',
    tags: ['Street Food']
  },
  {
    id: 'f7',
    name: 'Fresh Mango & Mint Smoothie',
    category: 'Beverages',
    price: 60,
    isVeg: true,
    calories: 180,
    prepTimeMinutes: 4,
    available: true,
    rating: 4.8,
    description: 'Fresh alphonso pulp, Greek yogurt, chia seeds, and a hint of fresh garden mint.',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&q=80&w=400',
    tags: ['Healthy', 'Summer Hit']
  },
  {
    id: 'f8',
    name: 'Overnight Biryani Bowl with Raita',
    category: 'Specials',
    price: 150,
    isVeg: false,
    calories: 590,
    prepTimeMinutes: 6,
    available: true,
    rating: 4.9,
    description: 'Fragrant long-grain basmati cooked dum-style with succulent chicken, saffron, caramelised onions.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
    tags: ['Friday Special', 'Must Try']
  }
];

export const INITIAL_ORDERS: CanteenOrder[] = [
  {
    id: 'ord-101',
    tokenNumber: 'A-42',
    studentId: 'usr_student_1',
    studentName: 'Aarav Mehta (23CS048)',
    items: [
      { item: CANTEEN_ITEMS[0], quantity: 1 },
      { item: CANTEEN_ITEMS[3], quantity: 1 }
    ],
    totalAmount: 120,
    status: 'Ready',
    orderTime: '12:15 PM',
    estimatedPickupTime: 'Ready at Counter 2!',
    counterNumber: 'Counter 2 (Beverages & South)'
  },
  {
    id: 'ord-102',
    tokenNumber: 'B-18',
    studentId: 'usr_cr_1',
    studentName: 'Ananya Sharma (23CS012)',
    items: [
      { item: CANTEEN_ITEMS[1], quantity: 1 },
      { item: CANTEEN_ITEMS[6], quantity: 1 }
    ],
    totalAmount: 190,
    status: 'Preparing',
    orderTime: '12:22 PM',
    estimatedPickupTime: 'In ~5 mins',
    counterNumber: 'Counter 1 (Main Kitchen)'
  },
  {
    id: 'ord-103',
    tokenNumber: 'K-09',
    studentId: 'usr_student_3',
    studentName: 'Kunal Verma (23CS031)',
    items: [
      { item: CANTEEN_ITEMS[2], quantity: 2 },
      { item: CANTEEN_ITEMS[3], quantity: 2 }
    ],
    totalAmount: 290,
    status: 'Received',
    orderTime: '12:28 PM',
    estimatedPickupTime: 'In ~12 mins',
    counterNumber: 'Counter 1 (Fast Food)'
  },
  {
    id: 'ord-104',
    tokenNumber: 'C-77',
    studentId: 'usr_student_4',
    studentName: 'Riya Patel (23CS088)',
    items: [
      { item: CANTEEN_ITEMS[7], quantity: 1 }
    ],
    totalAmount: 150,
    status: 'Picked Up',
    orderTime: '11:45 AM',
    estimatedPickupTime: 'Collected',
    counterNumber: 'Counter 1 (Main Kitchen)'
  }
];

export const QUEUE_SERVICES: QueueService[] = [
  {
    id: 'canteen',
    title: 'Central Food Court',
    counterName: 'Counters 1 & 2',
    currentServing: 41,
    totalWaiting: 8,
    estimatedWaitMinutes: 5,
    status: 'Open',
    icon: 'Utensils'
  },
  {
    id: 'registrar',
    title: 'Registrar & Student Affairs',
    counterName: 'Desk 4, Admin Block Ground Floor',
    currentServing: 18,
    totalWaiting: 12,
    estimatedWaitMinutes: 18,
    status: 'Crowded',
    icon: 'FileBadge'
  },
  {
    id: 'library',
    title: 'Central Library Circulation',
    counterName: 'Issue / Return Desk 1',
    currentServing: 73,
    totalWaiting: 3,
    estimatedWaitMinutes: 3,
    status: 'Open',
    icon: 'BookOpen'
  },
  {
    id: 'clinic',
    title: 'Campus Health Centre & OPD',
    counterName: 'Doctor Consultation Chamber 2',
    currentServing: 11,
    totalWaiting: 4,
    estimatedWaitMinutes: 10,
    status: 'Open',
    icon: 'Stethoscope'
  },
  {
    id: 'accounts',
    title: 'Fee, Scholarship & Accounts',
    counterName: 'Accounts Counter 3',
    currentServing: 35,
    totalWaiting: 15,
    estimatedWaitMinutes: 22,
    status: 'Crowded',
    icon: 'CreditCard'
  }
];

export const NOTICES_DATA: Notice[] = [
  {
    id: 'n1',
    title: 'Mid-Semester Examination Schedule (Autumn 2026)',
    content: 'The Mid-Semester exams for all 3rd and 5th semester B.Tech programs will commence from October 20, 2026. Hall tickets will be downloadable from the portal starting Oct 14. Note that minimum 75% attendance is mandatory to appear for examinations without academic board clearance.',
    category: 'Exams',
    author: 'Controller of Examinations',
    authorRole: 'Examination Cell',
    date: 'Oct 02, 2026',
    isUrgent: true,
    isPinned: true,
    departmentScope: 'All Engineering Batches',
    attachments: [
      { name: 'MidSem_Exam_Schedule_Autumn2026.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Room_Seating_Arrangement.pdf', size: '1.1 MB', type: 'PDF' }
    ]
  },
  {
    id: 'n2',
    title: 'Campus Placement Drive: Google & Microsoft Pre-Placement Talks',
    content: 'Google Software Engineering and Cloud Systems teams will host a campus interactive seminar on October 10 at 4:30 PM in the Main Auditorium. Eligibility: CSE, ECE, EE with CGPA >= 8.0 with no standing backlogs. Formal dress code required.',
    category: 'Placement',
    author: 'Prof. S. R. Vardhan',
    authorRole: 'Head - Training & Placement Cell',
    date: 'Oct 01, 2026',
    isUrgent: true,
    attachments: [{ name: 'Job_Description_SDE_Intern.pdf', size: '480 KB', type: 'PDF' }]
  },
  {
    id: 'n3',
    title: 'Inter-Collegiate Hackathon "CodeStorm 2026" Registrations Open',
    content: 'The 36-hour flagship hackathon organized by GDG & ACM Campus Chapters features prizes worth $10,000, cloud compute credits, and internship fast-tracks. Team sizes 2-4 members.',
    category: 'Events',
    author: 'Aarav Mehta',
    authorRole: 'Student Lead, GDG Campus',
    date: 'Sep 29, 2026',
    isUrgent: false
  },
  {
    id: 'n4',
    title: 'Hostel Wi-Fi Upgradation Maintenance Downtime',
    content: 'High-speed Wi-Fi router firmware upgrades will take place in Aryabhatta and Gargi Hostels on Sunday, Oct 5th, between 2:00 AM and 5:00 AM. Internet access will be temporarily interrupted during these hours.',
    category: 'Administrative',
    author: 'IT Infrastructure Center',
    authorRole: 'Network Administrator',
    date: 'Sep 28, 2026',
    isUrgent: false
  }
];

export const EVENTS_DATA: CampusEvent[] = [
  {
    id: 'ev1',
    title: 'CodeStorm 2026: 36-Hour National Hackathon',
    category: 'Tech',
    date: 'Oct 17 - 19, 2026',
    time: 'Starts 09:00 AM',
    venue: 'Campus Innovation Center & Labs',
    organizer: 'ACM & GDG Student Society',
    description: 'Build breakthrough AI, Web3, and HealthTech solutions with industry mentors from top tech companies.',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    registeredCount: 420,
    maxSeats: 500,
    isRegistered: true,
    tags: ['AI/ML', 'Hackathon', 'Cash Prizes']
  },
  {
    id: 'ev2',
    title: 'Rhythm 2026: Annual Cultural Fest & Battle of Bands',
    category: 'Cultural',
    date: 'Nov 06 - 08, 2026',
    time: '04:00 PM - 10:00 PM',
    venue: 'Open Air Amphitheatre',
    organizer: 'Student Activity Council (SAC)',
    description: '3 days of non-stop dance, rock music, fashion showdowns, culinary stalls, and star night celebrity performances.',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
    registeredCount: 1850,
    maxSeats: 3000,
    isRegistered: false,
    ticketPrice: 0,
    tags: ['Music', 'Dance', 'Star Night']
  },
  {
    id: 'ev3',
    title: 'Workshop: Generative AI on Modern Cloud Infrastructure',
    category: 'Workshop',
    date: 'Oct 11, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'Seminar Hall 3',
    organizer: 'Department of Computer Science',
    description: 'Hands-on laboratory deploying transformer models, vector retrieval, and agent workflows using TypeScript & Python.',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    registeredCount: 110,
    maxSeats: 120,
    isRegistered: false,
    tags: ['Generative AI', 'Cloud', 'Hands-on']
  }
];

export const CLUBS_DATA: StudentClub[] = [
  {
    id: 'cl1',
    name: 'Google Developer Student Club (GDSC)',
    category: 'Technical',
    tagline: 'Bridging theory and industry with open source code',
    description: 'We organize peer-to-peer coding sessions, mobile dev bootcamps, Cloud study jams, and hackathons.',
    leadName: 'Aarav Mehta',
    leadRole: 'Lead Organizer',
    membersCount: 380,
    nextMeeting: 'Thursday, 05:00 PM @ CS Lab 1',
    isJoined: true,
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    tags: ['Web Dev', 'Mobile', 'AI/ML']
  },
  {
    id: 'cl2',
    name: 'RoboKnights Robotics & IoT Society',
    category: 'Technical',
    tagline: 'Building autonomous drones and competition rovers',
    description: 'Campus hub for hardware enthusiasts, 3D printing, embedded firmware, and national bot combat championships.',
    leadName: 'Rohan Deshmukh',
    leadRole: 'Captain',
    membersCount: 210,
    nextMeeting: 'Saturday, 11:00 AM @ Mech Mechatronics Lab',
    isJoined: false,
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    tags: ['Robotics', 'Hardware', 'Drones']
  },
  {
    id: 'cl3',
    name: 'Symphony Music & Fine Arts Guild',
    category: 'Arts & Music',
    tagline: 'Where campus acoustics come alive',
    description: 'A community of instrumentalists, vocalists, audio engineers, and visual artists jamming across classical and rock.',
    leadName: 'Kavya Pillai',
    leadRole: 'President',
    membersCount: 290,
    nextMeeting: 'Friday, 06:00 PM @ Jam Room (Student Center)',
    isJoined: true,
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
    tags: ['Acoustic', 'Rock', 'Jamming']
  },
  {
    id: 'cl4',
    name: 'Vanguard Debating & Model UN Society',
    category: 'Literary',
    tagline: 'Sharpening logic, rhetoric, and global diplomacy',
    description: 'Parliamentary debates, geopolitical discussions, MUN delegations, and oratorical skill development.',
    leadName: 'Tanya Banerjee',
    leadRole: 'Secretary General',
    membersCount: 165,
    nextMeeting: 'Wednesday, 05:30 PM @ Sem Hall A',
    isJoined: false,
    avatar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
    tags: ['Debate', 'MUN', 'Public Speaking']
  }
];

export const INITIAL_COMPLAINTS: GrievanceComplaint[] = [
  {
    id: 'comp-1',
    ticketNumber: 'GRV-2026-089',
    title: 'Water pressure low in 3rd floor washrooms',
    description: 'The overhead water motor supply seems choked since yesterday evening. Washrooms on the right wing are facing dry taps.',
    category: 'Hostel',
    location: 'Aryabhatta Hostel, 3rd Floor Wing B',
    priority: 'High',
    status: 'In Progress',
    submittedBy: 'Aarav Mehta',
    submittedAt: 'Oct 02, 2026, 08:30 AM',
    updatedAt: 'Oct 02, 2026, 11:15 AM',
    resolutionRemark: 'Plumbing supervisor dispatched. Valve replacement scheduled at 2:00 PM.'
  },
  {
    id: 'comp-2',
    ticketNumber: 'GRV-2026-074',
    title: 'Projector HDMI port damaged in LH-201',
    description: 'During Operating Systems lecture, the ceiling display flickers and disconnects intermittently.',
    category: 'Infrastructure',
    location: 'Lecture Hall LH-201',
    priority: 'Medium',
    status: 'Resolved',
    submittedBy: 'Dr. Rao / CS-3A CR',
    submittedAt: 'Sep 29, 2026, 02:00 PM',
    updatedAt: 'Sep 30, 2026, 04:30 PM',
    resolutionRemark: 'Cable swapped and new female HDMI terminal plate installed by AV team.'
  },
  {
    id: 'comp-3',
    ticketNumber: 'GRV-2026-092',
    title: 'Wi-Fi AP dropouts near CS Lab 3',
    description: 'Device connections get throttled down to 0.5 Mbps during afternoon lab sessions.',
    category: 'IT & Wi-Fi',
    location: 'Computer Center Floor 2',
    priority: 'Low',
    status: 'Submitted',
    submittedBy: 'Aarav Mehta',
    submittedAt: 'Oct 02, 2026, 03:45 PM',
    updatedAt: 'Oct 02, 2026, 03:45 PM'
  }
];

export const INITIAL_DOCUMENTS: DocumentRequest[] = [
  {
    id: 'doc-1',
    requestId: 'DOC-REQ-4091',
    type: 'Bonafide Certificate',
    purpose: 'Passport Application & Visa verification',
    status: 'Ready for Download',
    requestDate: 'Sep 28, 2026',
    completionDate: 'Sep 30, 2026',
    downloadUrl: '#bonafide-cert-pdf',
    remarks: 'Digitally signed by Assistant Registrar. Valid for 6 months.'
  },
  {
    id: 'doc-2',
    requestId: 'DOC-REQ-4112',
    type: 'Semester Grade Sheet',
    purpose: 'Internship verification for Google Summer of Code',
    status: 'Processing',
    requestDate: 'Oct 01, 2026',
    remarks: 'Verifying with Exam Cell database. Expected within 24 hours.'
  },
  {
    id: 'doc-3',
    requestId: 'DOC-REQ-3980',
    type: 'Fee Receipt',
    purpose: 'Income Tax Rebate for Education Loan',
    status: 'Ready for Download',
    requestDate: 'Sep 15, 2026',
    completionDate: 'Sep 15, 2026',
    downloadUrl: '#fee-receipt-pdf',
    remarks: 'Original digitally verified voucher.'
  }
];

export const SECTION_NOTES: SectionNote[] = [
  {
    id: 'sn1',
    title: 'OS Lecture Notes: Virtual Memory & Page Replacement Algorithms',
    subject: 'Operating Systems (CS501)',
    uploadedBy: 'Dr. Rao (Verified)',
    uploaderRole: 'Faculty',
    date: 'Yesterday, 4:00 PM',
    downloads: 74,
    fileSize: '4.8 MB',
    fileType: 'PDF'
  },
  {
    id: 'sn2',
    title: 'DBMS Cheat Sheet: Normalization (1NF to BCNF) & SQL Triggers',
    subject: 'DBMS (CS502)',
    uploadedBy: 'Ananya Sharma',
    uploaderRole: 'Class Rep',
    date: 'Sep 30, 2026',
    downloads: 98,
    fileSize: '2.1 MB',
    fileType: 'PDF'
  },
  {
    id: 'sn3',
    title: 'Algorithms Solved Question Bank (2022-2025 MidSem Papers)',
    subject: 'DAA (CS503)',
    uploadedBy: 'Aarav Mehta',
    uploaderRole: 'Student',
    date: 'Sep 27, 2026',
    downloads: 142,
    fileSize: '12.5 MB',
    fileType: 'ZIP'
  }
];

export const SECTION_POLL: SectionPoll = {
  id: 'poll-1',
  question: 'Should we request Dr. Rao to conduct the OS Semaphore Revision Lab on Saturday 10:00 AM or Monday evening?',
  author: 'Ananya Sharma (Class Representative)',
  deadline: 'Closes Friday 8:00 PM',
  totalVotes: 48,
  options: [
    { id: 'opt-1', text: 'Saturday 10:00 AM - 12:00 PM (In-person)', votes: 29 },
    { id: 'opt-2', text: 'Monday 5:30 PM - 7:00 PM (Hybrid/Online)', votes: 16 },
    { id: 'opt-3', text: 'No extra session needed', votes: 3 }
  ],
  userVotedId: 'opt-1'
};

export const INITIAL_TASKS: AcademicTask[] = [
  {
    id: 'task-1',
    title: 'Lab 4: Multi-threaded Producer-Consumer with POSIX Semaphores',
    courseCode: 'CS501',
    courseName: 'Operating Systems & Concurrency',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Vikramaditya Rao',
    assignedDate: 'Oct 01, 2026',
    dueDate: 'Tomorrow, 11:59 PM',
    dueTime: '11:59 PM',
    priority: 'High',
    type: 'Lab Assignment',
    totalPoints: 50,
    targetSection: 'CS-3A',
    description: 'Implement a bounded-buffer producer-consumer solution in C using pthread mutexes and sem_wait/sem_post primitives. Ensure deadlock avoidance and proper thread cleanup on termination. Submit Makefile and source .c files.',
    submissionsCount: 42,
    totalStudents: 64,
    status: 'Active',
    submittedStudents: ['23CS012', '23CS031', '23CS088']
  },
  {
    id: 'task-2',
    title: 'Assignment 3: B+ Tree Index Splitting & Analytical SQL Queries',
    courseCode: 'CS502',
    courseName: 'Database Management Systems',
    facultyId: 'usr_faculty_2',
    facultyName: 'Prof. Sunita Deshmukh',
    assignedDate: 'Sep 29, 2026',
    dueDate: 'Oct 08, 2026',
    dueTime: '05:00 PM',
    priority: 'Medium',
    type: 'Theory Homework',
    totalPoints: 40,
    targetSection: 'CS-3A',
    description: 'Solve the 4 numerical problems regarding B+ Tree insertion, node overflows, split propagation, and execute 3 complex window functions with EXPLAIN ANALYZE cost estimations in PostgreSQL.',
    submissionsCount: 28,
    totalStudents: 64,
    status: 'Active',
    submittedStudents: ['23CS012', '23CS048']
  },
  {
    id: 'task-3',
    title: 'Mini-Project: Concurrent Socket-Based Chat Protocol (TCP/IP)',
    courseCode: 'CS504',
    courseName: 'Computer Networks',
    facultyId: 'usr_faculty_3',
    facultyName: 'Dr. A. Bose',
    assignedDate: 'Sep 25, 2026',
    dueDate: 'Oct 14, 2026',
    dueTime: '11:59 PM',
    priority: 'High',
    type: 'Project Milestone',
    totalPoints: 100,
    targetSection: 'CS-3A',
    description: 'Develop a client-server command-line or GUI chat room that supports multiple simultaneous rooms, private direct messages, and graceful disconnect notifications using non-blocking I/O or select().',
    submissionsCount: 15,
    totalStudents: 64,
    status: 'Active',
    submittedStudents: ['23CS012']
  },
  {
    id: 'task-4',
    title: 'Problem Set 2: Master Theorem, Divide & Conquer Recurrences',
    courseCode: 'CS503',
    courseName: 'Design & Analysis of Algorithms',
    facultyId: 'usr_faculty_4',
    facultyName: 'Dr. Raman',
    assignedDate: 'Oct 02, 2026',
    dueDate: 'Oct 18, 2026',
    dueTime: '10:00 AM',
    priority: 'Low',
    type: 'Quiz Preparation',
    totalPoints: 25,
    targetSection: 'All Sections',
    description: 'Practice 15 asymptotic recurrence derivations including cases where standard Master theorem fails. Upload clean handwritten or LaTeX PDF proof sheet.',
    submissionsCount: 8,
    totalStudents: 128,
    status: 'Active',
    submittedStudents: []
  }
];

export const ENROLLED_STUDENTS: StudentAcademicRecord[] = [
  {
    id: 'stud-1',
    name: 'Aarav Mehta',
    rollNo: '23CS048',
    email: 'aarav.m@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 88.5,
    cgpa: 8.84,
    internalScore: 46,
    submissionsCompleted: 4,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98765 43210'
  },
  {
    id: 'stud-2',
    name: 'Ananya Sharma',
    rollNo: '23CS012',
    email: 'ananya.s@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 94.2,
    cgpa: 9.32,
    internalScore: 49,
    submissionsCompleted: 5,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98111 22334'
  },
  {
    id: 'stud-3',
    name: 'Kunal Verma',
    rollNo: '23CS031',
    email: 'kunal.v@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 71.4,
    cgpa: 7.45,
    internalScore: 34,
    submissionsCompleted: 2,
    totalAssignments: 5,
    attendanceRisk: true, // <75% attendance alert for faculty
    phone: '+91 98222 66778'
  },
  {
    id: 'stud-4',
    name: 'Riya Patel',
    rollNo: '23CS088',
    email: 'riya.p@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 82.0,
    cgpa: 8.15,
    internalScore: 42,
    submissionsCompleted: 4,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98333 77889'
  },
  {
    id: 'stud-5',
    name: 'Rohan Deshmukh',
    rollNo: '23CS019',
    email: 'rohan.d@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 69.8,
    cgpa: 6.92,
    internalScore: 28,
    submissionsCompleted: 1,
    totalAssignments: 5,
    attendanceRisk: true, // <75% attendance alert for faculty
    phone: '+91 98444 88990'
  },
  {
    id: 'stud-6',
    name: 'Kavya Pillai',
    rollNo: '23CS064',
    email: 'kavya.p@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 91.5,
    cgpa: 8.95,
    internalScore: 47,
    submissionsCompleted: 5,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98555 99001'
  },
  {
    id: 'stud-7',
    name: 'Ishaan Joshi',
    rollNo: '23CS052',
    email: 'ishaan.j@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 86.4,
    cgpa: 8.40,
    internalScore: 44,
    submissionsCompleted: 4,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98666 00112'
  },
  {
    id: 'stud-8',
    name: 'Priya Nair',
    rollNo: '23CS077',
    email: 'priya.n@campus.edu',
    department: 'Computer Science & Engineering',
    semester: 5,
    section: 'CS-3A',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    attendanceOverall: 78.5,
    cgpa: 7.88,
    internalScore: 39,
    submissionsCompleted: 3,
    totalAssignments: 5,
    attendanceRisk: false,
    phone: '+91 98777 11223'
  }
];
