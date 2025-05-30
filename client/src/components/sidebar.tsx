import { useState, type JSX } from "react";
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
import { MdClose } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth-slice";
import { toast } from "sonner";

interface NavItem {
  key: string;
  icon: JSX.Element;
  route?: string;
  action?: () => void;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = user?.role || "user";
  const userName = user?.name || "Guest";

  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout())
      .then(() => {
        toast.success("Success", { description: "Logout successful" });
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error", {
          description: error.message || "Logout failed",
        });
      });
  };

  const navItems: NavItem[] = [
    { key: "Dashboard", icon: <FaTasks />, route: "/dashboard" },
    { key: "Care Plans", icon: <FaTasks />, route: "/dashboard/care-plans" },
    {
      key: "Appointments",
      icon: <FaCalendarAlt />,
      route: "/dashboard/appointments",
    },
    { key: "Medications", icon: <FaPills />, route: "/dashboard/medications" },
    {
      key: "Emergency Alerts",
      icon: <FaExclamationTriangle />,
      route: "/dashboard/emergency-alerts",
    },
    { key: "Files", icon: <FaFileAlt />, route: "/dashboard/files" },
    {
      key: "Notifications",
      icon: <FaBell />,
      route: "/dashboard/notifications",
    },
    { key: "Settings", icon: <FaCog />, route: "/dashboard/settings" },
    {
      key: "Family Sharing",
      icon: <FaUsers />,
      route: "/dashboard/family-sharing",
    },
    { key: "Search", icon: <FaSearch />, route: "/dashboard/search" },
    {
      key: "Logout",
      icon: <FaSignOutAlt />,
      action: () => setIsDialogOpen(true),
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 md:sticky md:top-0 h-screen transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 w-full md:w-72 bg-white border-r border-gray-200 p-6 space-y-6`}
    >
      <div className="flex items-center gap-3 mb-8">
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User avatar" />
          <AvatarFallback className="bg-green-400 text-white">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-gray-800">{userName}</h2>
          <Badge className="bg-green-100 text-green-600 capitalize">
            {userRole}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-600 hover:bg-green-50"
          aria-label="Close sidebar"
        >
          <MdClose size={24} />
        </Button>
      </div>
      <nav className="space-y-1 text-sm">
        {navItems.map((item, index) => {
          const isActive = item.route && location.pathname === item.route;
          return item.key === "Logout" ? (
            <Dialog
              key={index}
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            >
              <DialogTrigger asChild>
                <button
                  className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors text-gray-600 hover:bg-green-50 hover:text-green-700`}
                  aria-label={item.key}
                  onClick={() => {
                    item.action?.();
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <span className="text-red-400">{item.icon}</span>
                  <span>{item.key}</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Link
              key={index}
              to={item.route!}
              className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors ${
                isActive
                  ? "bg-green-400 text-white"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
              aria-label={`Navigate to ${item.key}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className={isActive ? "text-white" : "text-green-400"}>
                {item.icon}
              </span>
              <span>{item.key}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
