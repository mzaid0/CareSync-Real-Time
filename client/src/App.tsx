import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import DashboardLayout from "./components/layouts/dashboard-layout";
import AboutPage from "./pages/about";
import EmergencyAlertsPage from "./pages/alerts";
import AppointmentPage from "./pages/appointments";
import CarePlansPage from "./pages/Careplan-page";
import CarePlanDetailPage from "./pages/careplan-details";
import Dashboard from "./pages/dashboard";
import FamilySharingPage from "./pages/family-sharing";
import FeaturesPage from "./pages/features";
import FileManagementPage from "./pages/files";
import LandingPage from "./pages/Home-page";
import LoginPage from "./pages/Login-page";
import MedicationPage from "./pages/medications";
import NotFoundPage from "./pages/Not-found-page";
import NotificationsPage from "./pages/notifictions";
import RegisterPage from "./pages/Register-page";
import SearchPage from "./pages/search";
import SettingsPage from "./pages/settings";
import Header from "./components/header";
import Footer from "./components/footer";

const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/register", "/forgot-password"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Dashboard Layout with Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="care-plans" element={<CarePlansPage />} />
          <Route path="care-plans/:id" element={<CarePlanDetailPage />} />
          <Route path="appointments" element={<AppointmentPage />} />
          <Route path="medications" element={<MedicationPage />} />
          <Route path="emergency-alerts" element={<EmergencyAlertsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="files" element={<FileManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="family-sharing" element={<FamilySharingPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
