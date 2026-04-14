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
import CommitteesPage from './admin/modules/organization/committees/pages/CommitteesPage';
import CommitteeDetailPage from './admin/modules/organization/committees/pages/CommitteeDetailPage';
import CommitteeFormPage from './admin/modules/organization/committees/pages/CommitteeFormPage';
import CommitteesTreePage from './admin/modules/organization/committees/pages/CommitteesTreePage';
import CommitteeMembersPage from './admin/modules/organization/committees/pages/CommitteeMembersPage';
import CommitteeTypesPage from './admin/modules/organization/committee-types/pages/CommitteeTypesPage';
import CommitteeTypeDetailPage from './admin/modules/organization/committee-types/pages/CommitteeTypeDetailPage';
import PositionsPage from './admin/modules/organization/positions/pages/PositionsPage';
import PositionDetailPage from './admin/modules/organization/positions/pages/PositionDetailPage';
import PositionFormPage from './admin/modules/organization/positions/pages/PositionFormPage';
import CommitteeAssignmentsPage from './admin/modules/organization/committee-assignments/pages/CommitteeAssignmentsPage';
import CommitteeAssignmentDetailPage from './admin/modules/organization/committee-assignments/pages/CommitteeAssignmentDetailPage';
import CommitteeAssignmentFormPage from './admin/modules/organization/committee-assignments/pages/CommitteeAssignmentFormPage';
import ReportingHierarchyPage from './admin/modules/organization/reporting-hierarchy/pages/ReportingHierarchyPage';
import ReportingHierarchyDetailPage from './admin/modules/organization/reporting-hierarchy/pages/ReportingHierarchyDetailPage';
import ReportingHierarchyFormPage from './admin/modules/organization/reporting-hierarchy/pages/ReportingHierarchyFormPage';
import CommitteeHierarchyTreePage from './admin/modules/organization/reporting-hierarchy/pages/CommitteeHierarchyTreePage';
import './admin/admin.css';
import './admin/admin-shell.css';
import './admin/modules/membership/membership.css';
import './admin/modules/organization/organization.css';
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

          <Route path="committees" element={<CommitteesPage />} />
          <Route path="committees/create" element={<CommitteeFormPage />} />
          <Route path="committees/:id" element={<CommitteeDetailPage />} />
          <Route path="committees/:id/edit" element={<CommitteeFormPage />} />
          <Route path="committees/:committeeId/members" element={<CommitteeMembersPage />} />
          <Route path="committees/:committeeId/hierarchy-tree" element={<CommitteeHierarchyTreePage />} />
          <Route path="committees-tree" element={<CommitteesTreePage />} />

          <Route path="committee-types" element={<CommitteeTypesPage />} />
          <Route path="committee-types/:id" element={<CommitteeTypeDetailPage />} />

          <Route path="positions" element={<PositionsPage />} />
          <Route path="positions/create" element={<PositionFormPage />} />
          <Route path="positions/:id" element={<PositionDetailPage />} />
          <Route path="positions/:id/edit" element={<PositionFormPage />} />

          <Route path="committee-assignments" element={<CommitteeAssignmentsPage />} />
          <Route path="committee-assignments/create" element={<CommitteeAssignmentFormPage />} />
          <Route path="committee-assignments/:id" element={<CommitteeAssignmentDetailPage />} />
          <Route path="committee-assignments/:id/edit" element={<CommitteeAssignmentFormPage />} />

          <Route path="reporting-hierarchy" element={<ReportingHierarchyPage />} />
          <Route path="reporting-hierarchy/create" element={<ReportingHierarchyFormPage />} />
          <Route path="reporting-hierarchy/:id" element={<ReportingHierarchyDetailPage />} />
          <Route path="reporting-hierarchy/:id/edit" element={<ReportingHierarchyFormPage />} />
        </Route>
      </Routes>
    </>
  );
}
