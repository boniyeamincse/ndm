import { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingJoin from './components/FloatingJoin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLayout from './admin/layouts/AdminLayout';
import MembershipApplicationsPage from './admin/modules/membership/applications/pages/MembershipApplicationsPage';
import MembershipApplicationDetailPage from './admin/modules/membership/applications/pages/MembershipApplicationDetailPage';
import MembersPage from './admin/modules/membership/members/pages/MembersPage';
import MemberDetailPage from './admin/modules/membership/members/pages/MemberDetailPage';
import './admin/admin.css';
import './admin/admin-shell.css';
import './admin/modules/membership/membership.css';
import Home from './pages/Home';
import About from './pages/About';
import Leadership from './pages/Leadership';
import Activities from './pages/Activities';
import News from './pages/News';
import Publications from './pages/Publications';
import Constitution from './pages/Constitution';
import Join from './pages/Join';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MemberDashboard from './pages/MemberDashboard';
import ProfileSetup from './pages/ProfileSetup';
import { useLang } from './context/LanguageContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// Wrapper that shows public Navbar + Footer only for non-admin routes
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingJoin />
    </>
  );
}

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    document.body.className = lang === 'bn' ? 'lang-bn' : '';
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes — wrapped with Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/news" element={<News />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/constitution" element={<Constitution />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/member/profile-setup"
            element={(
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/member/dashboard"
            element={(
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            )}
          />
        </Route>

        {/* Admin routes — no public Navbar/Footer, AdminLayout handles its own shell */}
        <Route
          path="/admin"
          element={(
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          )}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="membership-applications" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/pending" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/under-review" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/approved" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/rejected" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/on-hold" element={<MembershipApplicationsPage />} />
          <Route path="membership-applications/:id" element={<MembershipApplicationDetailPage />} />

          <Route path="members" element={<MembersPage />} />
          <Route path="members/active" element={<MembersPage />} />
          <Route path="members/inactive" element={<MembersPage />} />
          <Route path="members/suspended" element={<MembersPage />} />
          <Route path="members/leadership" element={<MembersPage />} />
          <Route path="members/new" element={<MembersPage />} />
          <Route path="members/:id" element={<MemberDetailPage />} />
          <Route path="members/:id/edit" element={<MemberDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}
