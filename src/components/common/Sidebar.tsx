import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, CalendarDays, 
  Clock, UtensilsCrossed, Layers, BellRing, Sparkles, 
  ShieldAlert, FileText, Bot, Settings2, UserCheck, 
  ChefHat, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCanteenCart } from '../../context/CanteenCartContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { cartCount, activeOrders } = useCanteenCart();

  // Role-specific customized navigation
  const getNavigationGroups = (): NavGroup[] => {
    // 1. CANTEEN CHEF: Specialized, streamlined navigation for orders placed & kitchen
    if (user?.role === 'canteen_staff') {
      const pendingCount = activeOrders.filter(o => o.status === 'Received' || o.status === 'Preparing').length;
      return [
        {
          title: 'Kitchen Command Center',
          items: [
            { 
              name: 'Orders Placed (Live)', 
              path: '/', 
              icon: ChefHat, 
              badge: pendingCount > 0 ? `${pendingCount} new` : `${activeOrders.length}` 
            },
            { 
              name: 'Food Court Menu', 
              path: '/canteen', 
              icon: UtensilsCrossed 
            },
            { 
              name: 'Cafeteria Queue Desks', 
              path: '/queue', 
              icon: Layers, 
              badge: 'Live' 
            }
          ]
        },
        {
          title: 'Staff Identity',
          items: [
            { name: 'Chef Credentials', path: '/profile', icon: UserCheck }
          ]
        }
      ];
    }

    // 2. FACULTY & TEACHERS: Teaching, student records & tasks
    if (user?.role === 'faculty') {
      return [
        {
          title: 'Academic Instruction',
          items: [
            { name: 'Dashboard & Roster', path: '/', icon: LayoutDashboard },
            { name: 'Coursework & Tasks', path: '/academics', icon: BookOpen },
            { name: 'Section CS-3A Desk', path: '/section', icon: Users, badge: 'CS-3A' },
            { name: 'Weekly Schedule', path: '/timetable', icon: Clock },
            { name: 'Academic Calendar', path: '/calendar', icon: CalendarDays }
          ]
        },
        {
          title: 'Campus Governance',
          items: [
            { name: 'Notices & Circulars', path: '/notices', icon: BellRing },
            { name: 'Document Portal', path: '/documents', icon: FileText },
            { name: 'Campus AI Advisor', path: '/ai', icon: Bot, isAi: true },
            { name: 'Faculty Identity', path: '/profile', icon: UserCheck }
          ]
        }
      ];
    }

    // 3. STUDENTS & CRS: Standard complete student experience
    return [
      {
        title: 'Academics & Study',
        items: [
          { name: 'Dashboard', path: '/', icon: LayoutDashboard },
          { name: 'Courses & Attendance', path: '/academics', icon: BookOpen },
          { name: 'Section Workspace', path: '/section', icon: Users, badge: 'CS-3A' },
          { name: 'Weekly Timetable', path: '/timetable', icon: Clock },
          { name: 'Academic Calendar', path: '/calendar', icon: CalendarDays }
        ]
      },
      {
        title: 'Campus Life',
        items: [
          { 
            name: 'Food Court & Canteen', 
            path: '/canteen', 
            icon: UtensilsCrossed,
            badge: cartCount > 0 ? `${cartCount} in cart` : undefined
          },
          { name: 'Live Queue Desks', path: '/queue', icon: Layers, badge: 'Live' },
          { name: 'Notices & Circulars', path: '/notices', icon: BellRing },
          { name: 'Events & Fests', path: '/events', icon: Sparkles },
          { name: 'Clubs & Societies', path: '/clubs', icon: Users }
        ]
      },
      {
        title: 'Student Services',
        items: [
          { name: 'Grievance Desk', path: '/complaints', icon: ShieldAlert },
          { name: 'Document Portal', path: '/documents', icon: FileText },
          { name: 'Campus AI Advisor', path: '/ai', icon: Bot, isAi: true },
          { name: 'Admin Console', path: '/admin', icon: Settings2, adminOnly: true },
          { name: 'Student Smart ID', path: '/profile', icon: UserCheck }
        ]
      }
    ];
  };

  const navigationGroups = getNavigationGroups();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container (Rich Porcelain Canvas & Emerald Accents) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#07130E] border-r border-[#047857]/15 dark:border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 px-4 border-b border-[#047857]/15 dark:border-white/[0.08] flex items-center justify-between">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="md" subtitle="CKPCET Surat" />
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#526059] hover:text-[#047857] hover:bg-black/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="px-3.5 py-3 mx-3 mt-3 bg-[#F6F8F6] dark:bg-[#0B1B14] rounded-2xl border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2.5">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#047857]/20 dark:ring-white/20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] truncate">
              {user?.name}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#526059] dark:text-[#94A3B8]">
              <span className="font-mono text-[10px]">{user?.rollNo}</span>
              <span>•</span>
              <span className="capitalize font-medium text-[#047857] dark:text-[#34D399]">
                {user?.role === 'canteen_staff' ? 'Chef' : user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[11px] font-apple font-semibold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8]">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-[#047857] text-white shadow-2xs font-semibold'
                            : 'text-[#141B18] dark:text-[#94A3B8] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] hover:text-[#047857] dark:hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 transition-colors ${
                                isActive
                                  ? 'text-white'
                                  : item.isAi
                                  ? 'text-[#D97706]'
                                  : 'text-[#526059] group-hover:text-[#047857] dark:group-hover:text-white'
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quick Status */}
        <div className="p-3 border-t border-[#047857]/15 dark:border-white/[0.08] text-[11px] text-[#526059] dark:text-[#94A3B8] bg-[#F6F8F6]/80 dark:bg-[#091811]">
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Autumn Term 2026
            </span>
            <span className="font-mono text-[10px] opacity-75">CKPCET</span>
          </div>
        </div>
      </aside>
    </>
  );
};
