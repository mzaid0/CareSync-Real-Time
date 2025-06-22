import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBell, FaSearch, FaCommentDots } from "react-icons/fa";
import { MdOutlineEmergency } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { mockUser } from "@/constants/dashboard-data";

interface DashboardHeaderProps {
    notificationsOpen: boolean;
    setNotificationsOpen: (open: boolean) => void;
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
    emergencyStatus: boolean;
    setEmergencyStatus: (status: boolean) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    notificationsOpen,
    setNotificationsOpen,
    chatOpen,
    setChatOpen,
    emergencyStatus,
    setEmergencyStatus,
}) => {
    return (
        <header className="bg-white py-4 px-6 rounded-2xl shadow-sm border border-green-100 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, {mockUser.name}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <FaUserMd className="text-green-500 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last login</p>
                            <p className="text-sm font-semibold text-gray-900">{mockUser.lastLogin}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Input
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 bg-green-50 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="text-gray-600 hover:bg-green-50 rounded-xl"
                        >
                            <FaBell size={18} />
                        </Button>
                        <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs">4</Badge>
                    </div>

                    <Button
                        variant={emergencyStatus ? "destructive" : "outline"}
                        className={`gap-2 rounded-xl ${emergencyStatus ? "bg-red-500 hover:bg-red-600 text-white" : "border-red-500 text-red-500 hover:bg-red-50"}`}
                        onClick={() => setEmergencyStatus(!emergencyStatus)}
                    >
                        <MdOutlineEmergency className="text-lg" />
                        <span className="hidden sm:inline">Emergency</span>
                    </Button>

                    <Button
                        variant={chatOpen ? "default" : "outline"}
                        onClick={() => setChatOpen(!chatOpen)}
                        className={`gap-2 rounded-xl ${chatOpen ? "bg-green-500 hover:bg-green-600" : "text-gray-600 hover:bg-green-50 border-green-300"}`}
                    >
                        <FaCommentDots size={16} />
                        <span className="hidden sm:inline">Messages</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};