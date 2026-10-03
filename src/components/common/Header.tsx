import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, Sun, Moon, Bell, Search, ShoppingBag, 
  Wallet, ChevronDown, Check, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useCanteenCart } from '../../context/CanteenCartContext';
import { BrandLogo } from './BrandLogo';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onOpenSearch }) => {
  const { user, loginAs, topUpWallet, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { cartCount, activeOrders } = useCanteenCart();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(200);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'student', label: 'Aarav Mehta', desc: 'Student • CSE 3rd Year' },
    { role: 'cr', label: 'Ananya Sharma', desc: 'Class Rep (CR) • CS-3A' },
    { role: 'faculty', label: 'Dr. Rao', desc: 'Faculty & Lab Head' },
    { role: 'canteen_staff', label: 'Chef Rameshwar', desc: 'Canteen Supervisor' },
    { role: 'admin', label: 'Dean Mukherjee', desc: 'Campus Administration' }
  ];

  const readyOrder = activeOrders.find((o) => o.status === 'Ready');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-[#07130E]/85 backdrop-blur-xl border-b border-[#047857]/15 dark:border-white/[0.08] transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand in mobile + Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-[#047857] dark:text-[#F3F7F5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand mark with provided emblem image next to brand name UniFlow */}
          <Link to="/" className="flex items-center">
            <BrandLogo size="sm" subtitle="CKPCET" className="lg:hidden" />
            <BrandLogo size="sm" subtitle="CKPCET Surat" className="hidden lg:inline-flex pr-3 border-r border-[#047857]/15 dark:border-white/[0.08]" />
          </Link>

          {/* Quick Search Bar (Apple Spotlight style) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] text-[#526059] dark:text-[#94A3B8] hover:bg-[#EEF3F0] dark:hover:bg-[#123628] transition-colors text-xs sm:text-sm w-36 sm:w-64 border border-black/[0.04] dark:border-white/[0.06]"
          >
            <Search className="w-4 h-4 shrink-0 text-[#047857] dark:text-[#34D399]" />
            <span className="truncate">Search UniFlow...</span>
            <span className="hidden sm:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white dark:bg-[#0B1B14] text-[#526059] dark:text-[#94A3B8] border border-black/[0.06] dark:border-white/[0.08] shadow-2xs">
              ⌘K
            </span>
          </button>

          {/* Active Canteen Token Alert Badge */}
          {readyOrder && (
            <Link
              to="/canteen"
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857] text-white text-xs font-semibold shadow-xs hover:bg-[#065F46] transition-colors animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-[#34D399]"></span>
              <span>Token #{readyOrder.tokenNumber} Ready for Pickup!</span>
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Campus Wallet */}
          <button
            onClick={() => setShowWalletModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0B1B14] hover:bg-[#F6F8F6] dark:hover:bg-[#0E281E] border border-black/[0.08] dark:border-white/[0.1] text-[#047857] dark:text-[#F3F7F5] text-xs sm:text-sm font-semibold transition-all shadow-2xs"
            title="Campus Smart Wallet"
          >
            <Wallet className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
            <span className="font-mono">₹{user?.walletBalance ?? 0}</span>
            <Plus className="w-3 h-3 ml-0.5 text-[#047857] dark:text-[#34D399]" />
          </button>

          {/* Canteen Cart */}
          <Link
            to="/canteen"
            className="relative p-2 rounded-full text-[#141B18] dark:text-[#F3F7F5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title="Canteen Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#047857] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
              }}
              className="relative p-2 rounded-full text-[#141B18] dark:text-[#F3F7F5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#059669] ring-2 ring-white dark:ring-[#07130E]"></span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 dark:border-white/[0.1] shadow-2xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-apple font-bold text-xs tracking-tight text-[#047857] dark:text-[#F3F7F5]">
                    Institutional Circulars ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#047857] dark:text-[#34D399] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        n.read
                          ? 'bg-transparent hover:bg-[#F6F8F6] dark:hover:bg-white/[0.04]'
                          : 'bg-[#ECFDF5] dark:bg-[#062318] hover:bg-[#E0F9EC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5]">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#526059] dark:text-[#94A3B8] whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#141B18] dark:text-[#F3F7F5] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-[#34D399]" /> : <Moon className="w-5 h-5 text-[#047857]" />}
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover ring-1.5 ring-[#047857]/30 dark:ring-white/20"
              />
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-[#141B18] dark:text-[#F3F7F5] truncate max-w-[110px]">
                  {user?.name}
                </div>
                <div className="text-[10px] text-[#526059] dark:text-[#94A3B8] font-medium capitalize">
                  {user?.role === 'canteen_staff' ? 'Chef' : user?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#526059]" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 dark:border-white/[0.1] shadow-2xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center gap-3 p-2.5 mb-2 bg-[#F6F8F6] dark:bg-[#0E281E] rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#047857]/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#141B18] dark:text-[#F3F7F5] truncate">
                      {user?.name}
                    </div>
                    <div className="text-xs text-[#526059] dark:text-[#94A3B8] truncate">{user?.email}</div>
                    <div className="text-[10px] font-mono text-[#047857] dark:text-[#34D399] font-bold">
                      {user?.rollNo}
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <span className="text-[10px] font-apple font-bold text-[#526059] dark:text-[#94A3B8] uppercase tracking-wider px-2">
                    Switch Persona
                  </span>
                  <div className="mt-1 space-y-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          loginAs(r.role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          user?.role === r.role
                            ? 'bg-[#047857] text-white font-semibold shadow-2xs'
                            : 'hover:bg-[#F6F8F6] dark:hover:bg-white/[0.06] text-[#141B18] dark:text-[#F3F7F5]'
                        }`}
                      >
                        <div>
                          <div>{r.label}</div>
                          <div className={`text-[10px] font-normal ${user?.role === r.role ? 'text-white/80' : 'text-[#526059]'}`}>
                            {r.desc}
                          </div>
                        </div>
                        {user?.role === r.role && <Check className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setShowRoleDropdown(false)}
                    className="text-xs font-semibold text-[#047857] dark:text-[#34D399] hover:underline"
                  >
                    View Official ID
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top up modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B1B14] border border-[#047857]/20 dark:border-white/[0.1] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-apple text-lg font-bold text-[#047857] dark:text-[#F3F7F5] flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
              Campus Smart Wallet
            </h3>
            <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
              Top up balance for food court, library desk, and laboratories.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] text-center">
              <span className="text-xs text-[#526059] dark:text-[#94A3B8] block">Available Balance</span>
              <span className="text-3xl font-extrabold text-[#047857] dark:text-white font-mono">
                ₹{user?.walletBalance ?? 0}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    topUpAmount === amt
                      ? 'bg-[#047857] text-white border-[#047857] shadow-sm'
                      : 'border-black/[0.08] dark:border-white/[0.1] text-[#141B18] dark:text-[#F3F7F5] hover:bg-[#F6F8F6]'
                  }`}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowWalletModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-[#526059] dark:text-[#94A3B8] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  topUpWallet(topUpAmount);
                  setShowWalletModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold shadow-md transition-colors"
              >
                Add ₹{topUpAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
