import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { auth, googleProvider, testFirestoreConnection } from '../firebase/config';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { saveUserProfile } from '../firebase/firestoreService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  signUp: (userData: Partial<UserProfile>, password?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithCredentials: (emailOrRoll: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  topUpWallet: (amount: number) => void;
  deductWallet: (amount: number) => boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedRole = localStorage.getItem('campushub_user_role') as UserRole | null;
    if (savedRole && DEMO_USERS[savedRole]) {
      return DEMO_USERS[savedRole];
    }
    // Default logged in as student for seamless first experience
    return DEMO_USERS.student;
  });

  // Verify connection to Firestore on initial boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user into a profile if signed in via Google
        const googleProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          role: 'student',
          rollNo: '23CS-GOOG',
          department: 'Computer Science & Engineering',
          semester: 5,
          section: 'CS-3A',
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          walletBalance: 1000,
          cgpa: 8.9,
          attendanceOverall: 91.0,
          hostelRoom: 'Aryabhatta Hall 202',
          phone: '+91 99887 76655',
          bio: 'Undergraduate student authenticated via Firebase Google SSO'
        };
        setUser(googleProfile);
        saveUserProfile(googleProfile);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campushub_user_role', user.role);
      saveUserProfile(user);
    } else {
      localStorage.removeItem('campushub_user_role');
    }
  }, [user]);

  const loginAs = (role: UserRole) => {
    if (DEMO_USERS[role]) {
      const selected = { ...DEMO_USERS[role] };
      setUser(selected);
      saveUserProfile(selected);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google sign-in popup closed or bypassed:', err);
    }
  };

  const signUp = async (userData: Partial<UserProfile>, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!userData.name || !userData.email) {
        return { success: false, error: 'Name and email are required.' };
      }

      const role: UserRole = userData.role || 'student';
      const newId = `usr_${role}_${Date.now()}`;
      
      const newProfile: UserProfile = {
        id: newId,
        name: userData.name,
        email: userData.email,
        role,
        rollNo: userData.rollNo || (role === 'student' ? `23CS${Math.floor(100 + Math.random() * 899)}` : role === 'faculty' ? `FAC-${Math.floor(100 + Math.random() * 899)}` : 'STAFF-01'),
        department: userData.department || 'Computer Science & Engineering',
        semester: userData.semester ?? (role === 'student' ? 5 : 0),
        section: userData.section || (role === 'student' ? 'CS-3A' : 'Administration'),
        avatar: userData.avatar || (role === 'faculty' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
          : role === 'canteen_staff'
          ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=250'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
        walletBalance: role === 'student' ? 500 : 2000,
        cgpa: role === 'student' ? (userData.cgpa || 8.5) : 0,
        attendanceOverall: role === 'student' ? (userData.attendanceOverall || 88.0) : 100,
        hostelRoom: userData.hostelRoom || (role === 'student' ? 'Hostel Block A' : undefined),
        phone: userData.phone || '+91 98000 00000',
        bio: userData.bio || `Official ${role} profile registered at CKPCET UniFlow portal`
      };

      setUser(newProfile);
      saveUserProfile(newProfile);
      localStorage.setItem('campushub_custom_profile', JSON.stringify(newProfile));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to create account.' };
    }
  };

  const signInWithCredentials = async (emailOrRoll: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const trimmed = emailOrRoll.trim().toLowerCase();
      // Match against demo users or custom stored profile
      const foundDemo = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === trimmed || u.rollNo.toLowerCase() === trimmed
      );

      if (foundDemo) {
        setUser({ ...foundDemo });
        saveUserProfile(foundDemo);
        return { success: true };
      }

      // Check localStorage for previously registered user
      const stored = localStorage.getItem('campushub_custom_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as UserProfile;
          if (parsed.email.toLowerCase() === trimmed || parsed.rollNo.toLowerCase() === trimmed) {
            setUser(parsed);
            saveUserProfile(parsed);
            return { success: true };
          }
        } catch {}
      }

      // If not matched, generate/login as student with provided identifier
      const fallbackProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: emailOrRoll.includes('@') ? emailOrRoll.split('@')[0].replace('.', ' ') : 'University Student',
        email: emailOrRoll.includes('@') ? emailOrRoll : `${emailOrRoll}@ckpcet.ac.in`,
        role: emailOrRoll.toLowerCase().includes('fac') || emailOrRoll.toLowerCase().includes('prof') ? 'faculty' : 'student',
        rollNo: emailOrRoll.includes('@') ? '23CS-REG' : emailOrRoll.toUpperCase(),
        department: 'Computer Science & Engineering',
        semester: 5,
        section: 'CS-3A',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        walletBalance: 600,
        cgpa: 8.6,
        attendanceOverall: 87.5,
        phone: '+91 99880 11223',
        bio: 'Authenticated student via institutional credential credentials'
      };

      setUser(fallbackProfile);
      saveUserProfile(fallbackProfile);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Login failed.' };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    setUser(null);
  };

  const topUpWallet = (amount: number) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, walletBalance: prev.walletBalance + amount };
      saveUserProfile(updated);
      return updated;
    });
  };

  const deductWallet = (amount: number): boolean => {
    if (!user || user.walletBalance < amount) return false;
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, walletBalance: prev.walletBalance - amount };
      saveUserProfile(updated);
      return updated;
    });
    return true;
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveUserProfile(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAs,
        loginWithGoogle,
        signUp,
        signInWithCredentials,
        logout,
        topUpWallet,
        deductWallet,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
