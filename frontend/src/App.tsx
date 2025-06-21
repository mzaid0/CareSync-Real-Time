import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import DashboardLayout from "./layouts/dashboard-layout";

import HomePage from "./pages/home-page";
import Dashboard from "./pages/dashboard";
import NotFoundPage from "./pages/not-found";

const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/register", "/forgot-password"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

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
