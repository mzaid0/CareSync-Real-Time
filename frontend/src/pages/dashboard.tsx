// Dashboard.tsx
// import { AdminContent } from "@/components/dashboard/AdminContent";
import { AlertModal } from "../components/dashboard/alert-model";
// import { CaregiverContent } from "@/components/dashboard/CaregiverContent"; 
import { ChatPanel } from "../components/dashboard/chat-panel";
// import { FamilyMemberContent } from "@/components/dashboard/FamilyMemberContent";
import CustomCalendar from "@/components/custom-calander";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/showToast";
import {
    appointments,
    assignedTasks,
    carePlans,
    medications,
    mockStats,
    mockUser,
} from "@/constants/dashboard-data";
import type { Notification } from "@/types/types";
import { useState } from "react";
import { FaBell, FaCalendarAlt, FaChevronRight, FaCommentDots, FaExclamationTriangle, FaPills, FaPlus, FaSearch, FaTasks } from "react-icons/fa";
import { NotificationsPanel } from "../components/dashboard/notification-panel";
import { TaskModal } from "../components/dashboard/task-model";
import { UserContent } from "../components/dashboard/user-content";
const Dashboard = () => {

    const [date, setDate] = useState<Date | null>(new Date());
    const [realTimeNotifications, setRealTimeNotifications] = useState<Notification[]>([
        { type: "task", message: "Task Updated: Morning Medication → Completed" },
        { type: "alert", message: "Emergency Alert: Fall Detected" },
        { type: "appointment", message: "New Appointment Scheduled with Dr. Smith" },
    ]);
    const [emergencyStatus, setEmergencyStatus] = useState<boolean>(false);
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
    const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
    const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);
    const [notificationFilter, setNotificationFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [newTask, setNewTask] = useState({ taskName: "", dueDate: "", assignee: "" });
    const [newAlert, setNewAlert] = useState({ type: "", description: "" });
    const [chatMessage, setChatMessage] = useState("");

    const calendarEvents = [
        ...carePlans.map((plan) => ({ title: `Task: ${plan.task}`, date: plan.dueDate })),
        ...medications.map((med) => ({ title: `Medication: ${med.name}`, date: med.date })),
        ...appointments.map((appt) => ({ title: `Appointment: ${appt.doctor}`, date: appt.date })),
        ...assignedTasks.map((task) => ({ title: `Task: ${task.task}`, date: task.dueDate })),
    ];

    const handleAddTask = () => {
        if (!newTask.taskName || !newTask.dueDate || !newTask.assignee) {
            showToast("error", "Error", { description: "Please fill in all task fields" });
            return;
        }
        setRealTimeNotifications([
            { type: "task", message: `New Task Added: ${newTask.taskName}` },
            ...realTimeNotifications,
        ]);
        setTaskModalOpen(false);
        setNewTask({ taskName: "", dueDate: "", assignee: "" });
        showToast("success", "Success", { description: "Task added successfully" });
    };

    const handleAddAlert = () => {
        if (!newAlert.type || !newAlert.description) {
            showToast("error", "Error", { description: "Please fill in all alert fields" });
            return;
        }
        setRealTimeNotifications([
            { type: "alert", message: `New Alert: ${newAlert.type}` },
            ...realTimeNotifications,
        ]);
        setAlertModalOpen(false);
        setEmergencyStatus(true);
        setNewAlert({ type: "", description: "" });
        showToast("success", "Success", { description: "Alert created successfully" });
    };

    const handleResolveAlert = () => {
        setEmergencyStatus(false);
        setRealTimeNotifications([
            { type: "alert", message: "Emergency Alert Resolved" },
            ...realTimeNotifications,
        ]);
        showToast("success", "Success", { description: "Alert resolved" });
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        setRealTimeNotifications([
            { type: "task", message: `New Message: ${chatMessage}` },
            ...realTimeNotifications,
        ]);
        setChatMessage("");
        showToast("success", "Success", { description: "Message sent" });
    };

    const renderRoleSpecificContent = () => {
        switch (mockUser.role) {
            case "user":
                return <UserContent />;
            //   case "caregiver":
            //     return <CaregiverContent />;
            //   case "family_member":
            //     return <FamilyMemberContent />;
            //   case "admin":
            //     return <AdminContent />;
            default:
                return <div className="text-gray-500">Dashboard Under Development</div>;
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <main className="flex-1 p-8 space-y-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { }}
                            className="md:hidden text-gray-600 hover:bg-green-50"
                            aria-label="Open sidebar"
                        >
                            <FaChevronRight size={24} />
                        </Button>
                        <div className="relative flex-1 sm:w-96">
                            <Input
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-gray-200 focus:ring-green-400"
                                aria-label="Search"
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="text-gray-600 hover:bg-green-50"
                                aria-label="Open Notifications"
                            >
                                <FaBell size={20} />
                            </Button>
                            <Badge className="absolute -top-1 -right-1 bg-green-400 text-white">
                                {realTimeNotifications.length}
                            </Badge>
                            <NotificationsPanel
                                notificationsOpen={notificationsOpen}
                                notificationFilter={notificationFilter}
                                setNotificationFilter={setNotificationFilter}
                                realTimeNotifications={realTimeNotifications}
                            />
                        </div>
                        <Button
                            variant={emergencyStatus ? "destructive" : "outline"}
                            className="gap-2 border-red-400 text-red-500 hover:bg-red-50"
                            onClick={() => setEmergencyStatus(!emergencyStatus)}
                            aria-label="Emergency Button"
                        >
                            <FaExclamationTriangle />
                            Emergency Button
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setChatOpen(!chatOpen)}
                            className="text-gray-600 hover:bg-green-50"
                            aria-label="Open Chat"
                        >
                            <FaCommentDots size={20} />
                        </Button>
                    </div>
                </header>

                {emergencyStatus && (
                    <div className="bg-red-100 p-4 rounded-xl flex items-center justify-between gap-4 border border-red-200">
                        <div className="flex items-center gap-4">
                            <FaExclamationTriangle className="text-red-600" size={24} />
                            <p className="text-red-600 font-medium">Emergency Alert Active - Please take action</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-500 hover:bg-red-50"
                            onClick={handleResolveAlert}
                            aria-label="Resolve alert"
                        >
                            Resolve Alert
                        </Button>
                    </div>
                )}

                <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                            <FaPlus /> Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => setTaskModalOpen(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                aria-label="Add Task"
                            >
                                <FaTasks className="mr-2" /> Add Task
                            </Button>
                            <Button
                                variant="outline"
                                className="border-green-400 text-green-500 hover:bg-green-50"
                                aria-label="Add Appointment"
                            >
                                <FaCalendarAlt className="mr-2" /> Add Appointment
                            </Button>
                            <Button
                                variant="outline"
                                className="border-green-400 text-green-500 hover:bg-green-50"
                                aria-label="Add Medication"
                            >
                                <FaPills className="mr-2" /> Add Medication
                            </Button>
                            <Button
                                variant="outline"
                                className="border-red-400 text-red-500 hover:bg-red-50"
                                onClick={() => setAlertModalOpen(true)}
                                aria-label="Create Alert"
                            >
                                <FaExclamationTriangle className="mr-2" /> Create Alert
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {renderRoleSpecificContent()}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(mockStats).map(([key, value], i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-green-100 text-green-500">
                                    {key === "care_plans" && <FaTasks size={20} />}
                                    {key === "appointments" && <FaCalendarAlt size={20} />}
                                    {key === "medications" && <FaPills size={20} />}
                                    {key === "alerts" && <FaExclamationTriangle size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-500">
                                        {key === "care_plans"
                                            ? "Care Plans"
                                            : key === "appointments"
                                                ? "Appointments"
                                                : key === "medications"
                                                    ? "Medications"
                                                    : "Alerts"}
                                    </h3>
                                    <p className="text-2xl font-bold text-green-500">{value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-600">
                            <FaCalendarAlt /> Schedule Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomCalendar
                            value={date}
                            onChange={(newDate: Date) => setDate(newDate)}
                            events={calendarEvents.map((event) => ({
                                title: event.title,
                                start: new Date(event.date),
                                end: new Date(event.date),
                            }))}
                            className="w-full"
                            aria-label="Schedule calendar"
                        />
                    </CardContent>
                </Card>
            </main>

            <ChatPanel
                chatOpen={chatOpen}
                setChatOpen={setChatOpen}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                handleSendMessage={handleSendMessage}
            />
            <TaskModal
                taskModalOpen={taskModalOpen}
                setTaskModalOpen={setTaskModalOpen}
                newTask={newTask}
                setNewTask={setNewTask}
                handleAddTask={handleAddTask}
            />
            <AlertModal
                alertModalOpen={alertModalOpen}
                setAlertModalOpen={setAlertModalOpen}
                newAlert={newAlert}
                setNewAlert={setNewAlert}
                handleAddAlert={handleAddAlert}
            />
        </div>
    );
};

export default Dashboard;