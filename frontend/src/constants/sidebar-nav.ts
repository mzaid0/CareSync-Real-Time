import type { NavItem } from "@/types/navitems";
import {
  FaBell,
  FaCalendarAlt,
  FaCog,
  FaExclamationTriangle,
  FaFileAlt,
  FaPills,
  FaSearch,
  FaSignOutAlt,
  FaTasks,
  FaUsers,
} from "react-icons/fa";

export const NAV_ITEMS: NavItem[] = [
  { key: "Dashboard", icon: FaTasks, route: "/dashboard" },
  { key: "Care Plans", icon: FaTasks, route: "/dashboard/care-plans" },
  {
    key: "Appointments",
    icon: FaCalendarAlt,
    route: "/dashboard/appointments",
  },
  { key: "Medications", icon: FaPills, route: "/dashboard/medications" },
  {
    key: "Emergency Alerts",
    icon: FaExclamationTriangle,
    route: "/dashboard/emergency-alerts",
  },
  { key: "Files", icon: FaFileAlt, route: "/dashboard/files" },
  { key: "Notifications", icon: FaBell, route: "/dashboard/notifications" },
  { key: "Settings", icon: FaCog, route: "/dashboard/settings" },
  { key: "Family Sharing", icon: FaUsers, route: "/dashboard/family-sharing" },
  { key: "Search", icon: FaSearch, route: "/dashboard/search" },
  { key: "Logout", icon: FaSignOutAlt, isAction: true },
];
