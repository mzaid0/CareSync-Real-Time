import { NAV_ITEMS } from "@/constants/sidebar-nav";
import { useState } from "react";
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
import { useAuthStore } from "@/store/user-store";
import { LogOut } from "lucide-react";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const { user, logout } = useAuthStore();
    const userName = user?.name || "Guest";
    const userRole = user?.role || "unknown";

    const getInitials = (name: string) => {
        const parts = name.trim().split(" ");
        return parts.length >= 2
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : parts[0][0].toUpperCase();
    };

    const handleNavClick = () => {
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        setSidebarOpen(false);
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 md:sticky md:top-0 h-screen flex flex-col justify-between transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 w-full md:w-72 bg-white border-r border-gray-200 p-6`}
        >
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <Avatar>
                        <AvatarImage src="/avatar.png" alt="User avatar" />
                        <AvatarFallback className="bg-green-400 text-white">
                            {user?.name ? getInitials(user.name) : "?"}
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
                        className="md:hidden text-gray-600 hover:bg-green-50 ml-auto"
                        aria-label="Close sidebar"
                    >
                        <MdClose size={24} />
                    </Button>
                </div>

                <nav className="space-y-1 text-sm">
                    {NAV_ITEMS.map(({ key, icon: Icon, route, isAction }) => {
                        const isActive = route && location.pathname === route;

                        if (isAction) {
                            return (
                                <Dialog
                                    key={key}
                                    open={isActionDialogOpen}
                                    onOpenChange={setIsActionDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <button
                                            className="flex items-center w-full gap-3 p-2 rounded-md transition-colors text-gray-600 hover:bg-green-50 hover:text-green-700"
                                            aria-label={key}
                                            onClick={() => {
                                                setIsActionDialogOpen(true);
                                                handleNavClick();
                                            }}
                                        >
                                            <span className="text-red-400">
                                                <Icon className="w-4 h-4" />
                                            </span>
                                            <span>{key}</span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Confirm Action</DialogTitle>
                                            <DialogDescription>This is a placeholder action.</DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button variant="destructive" onClick={() => setIsActionDialogOpen(false)}>
                                                Confirm
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            );
                        }

                        if (!route) return null;

                        return (
                            <Link
                                key={key}
                                to={route}
                                aria-label={`Navigate to ${key}`}
                                onClick={handleNavClick}
                                className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors ${isActive
                                    ? "bg-green-400 text-white"
                                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                    }`}
                            >
                                <span className={isActive ? "text-white" : "text-green-400"}>
                                    <Icon className="w-4 h-4" />
                                </span>
                                <span>{key}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setIsLogoutDialogOpen(true)}
                        variant="outline"
                        className="w-full"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>Are you sure you want to log out?</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </aside>
    );
};

export default Sidebar;
