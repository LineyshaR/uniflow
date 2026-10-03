import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CanteenCartProvider } from './context/CanteenCartContext';
import { AppShell } from './components/layout/AppShell';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { SectionWorkspacePage } from './pages/SectionWorkspacePage';
import { TimetablePage } from './pages/TimetablePage';
import { CalendarPage } from './pages/CalendarPage';
import { CanteenPage } from './pages/CanteenPage';
import { QueuePage } from './pages/QueuePage';
import { NoticesPage } from './pages/NoticesPage';
import { EventsPage } from './pages/EventsPage';
import { ClubsPage } from './pages/ClubsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CanteenCartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="academics" element={<AcademicsPage />} />
                  <Route path="section" element={<SectionWorkspacePage />} />
                  <Route path="timetable" element={<TimetablePage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="canteen" element={<CanteenPage />} />
                  <Route path="queue" element={<QueuePage />} />
                  <Route path="notices" element={<NoticesPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="clubs" element={<ClubsPage />} />
                  <Route path="complaints" element={<ComplaintsPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="ai" element={<AiAssistantPage />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CanteenCartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
