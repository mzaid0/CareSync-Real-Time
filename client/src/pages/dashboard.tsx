import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import {
  FaBell,
  FaCalendarAlt,
  FaChartLine,
  FaChevronRight,
  FaCommentDots,
  FaExclamationTriangle,
  FaFileAlt,
  FaPills,
  FaPlus,
  FaSearch,
  FaTasks,
  FaUserPlus,
  FaUsers
} from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { MdClose, MdHealthAndSafety } from "react-icons/md";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomCalendar from "../components/custom-calander";

// Mock Data
const mockData = {
  user: {
    name: "John Doe",
    role: "user", // Switch to "user", "family_member", "caregiver", or "admin"
    avatar: "/avatar.png",
  },
  stats: {
    care_plans: 8,
    appointments: 5,
    medications: 12,
    alerts: 2,
  },
};

const mockUserData = {
  carePlans: [
    {
      id: 1,
      task: "Take morning medication",
      status: "Pending",
      progress: 50,
      dueDate: "2025-05-18",
    },
    {
      id: 2,
      task: "Attend physical therapy",
      status: "Completed",
      progress: 100,
      dueDate: "2025-05-15",
    },
  ],
  medications: [
    {
      id: 1,
      name: "Aspirin",
      time: "08:00",
      status: "Taken",
      date: "2025-05-18",
    },
    {
      id: 2,
      name: "Insulin",
      time: "12:00",
      status: "Pending",
      date: "2025-05-18",
    },
  ],
  appointments: [
    { id: 1, doctor: "Dr. Smith", time: "14:00", date: "2025-05-18" },
  ],
  healthStatus: [
    { time: "08:00", heartRate: 72, bloodPressure: 120 },
    { time: "12:00", heartRate: 75, bloodPressure: 122 },
    { time: "16:00", heartRate: 70, bloodPressure: 118 },
  ],
};

const mockCaregiverData = {
  assignedTasks: [
    {
      id: 1,
      task: "Assist with morning routine",
      status: "Pending",
      assignedTo: "Jane Doe",
      dueDate: "2025-05-18",
    },
    {
      id: 2,
      task: "Prepare lunch",
      status: "Completed",
      assignedTo: "John Doe",
      dueDate: "2025-05-15",
    },
  ],
  emergencyAlerts: [
    {
      id: 1,
      type: "Fall Detected",
      status: "Active",
      time: "2025-05-10 10:00",
    },
  ],
};

const mockFamilyMemberData = {
  healthStatus: [
    { time: "08:00", heartRate: 72, bloodPressure: 120 },
    { time: "12:00", heartRate: 75, bloodPressure: 122 },
    { time: "16:00", heartRate: 70, bloodPressure: 118 },
  ],
  appointments: [
    { id: 1, doctor: "Dr. Smith", time: "14:00", date: "2025-05-18" },
  ],
};

const mockAdminData = {
  users: [
    { id: 1, name: "Jane Doe", role: "user", email: "jane@example.com" },
    { id: 2, name: "Bob Smith", role: "caregiver", email: "bob@example.com" },
  ],
};

const Dashboard = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [realTimeNotifications, setRealTimeNotifications] = useState<
    { type: "task" | "alert" | "appointment"; message: string }[]
  >([
    { type: "task", message: "Task Updated: Morning Medication → Completed" },
    { type: "alert", message: "Emergency Alert: Fall Detected" },
    {
      type: "appointment",
      message: "New Appointment Scheduled with Dr. Smith",
    },
  ]);
  const [emergencyStatus, setEmergencyStatus] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [newTask, setNewTask] = useState({
    taskName: "",
    dueDate: "",
    assignee: "",
  });
  const [newAlert, setNewAlert] = useState({
    type: "",
    description: "",
  });
  const [chatMessage, setChatMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const calendarEvents = [
    ...mockUserData.carePlans.map((plan) => ({
      title: `Task: ${plan.task}`,
      date: plan.dueDate,
    })),
    ...mockUserData.medications.map((med) => ({
      title: `Medication: ${med.name}`,
      date: med.date,
    })),
    ...mockUserData.appointments.map((appt) => ({
      title: `Appointment: ${appt.doctor}`,
      date: appt.date,
    })),
    ...mockCaregiverData.assignedTasks.map((task) => ({
      title: `Task: ${task.task}`,
      date: task.dueDate,
    })),
  ];

  const handleAddTask = () => {
    if (!newTask.taskName || !newTask.dueDate || !newTask.assignee) {
      toast.error("Please fill in all task fields");
      return;
    }
    setRealTimeNotifications([
      { type: "task", message: `New Task Added: ${newTask.taskName}` },
      ...realTimeNotifications,
    ]);
    setTaskModalOpen(false);
    setNewTask({ taskName: "", dueDate: "", assignee: "" });
    toast.success("Task added successfully");
  };

  const handleAddAlert = () => {
    if (!newAlert.type || !newAlert.description) {
      toast.error("Please fill in all alert fields");
      return;
    }
    setRealTimeNotifications([
      { type: "alert", message: `New Alert: ${newAlert.type}` },
      ...realTimeNotifications,
    ]);
    setAlertModalOpen(false);
    setEmergencyStatus(true);
    setNewAlert({ type: "", description: "" });
    toast.success("Alert created successfully");
  };

  const handleResolveAlert = () => {
    setEmergencyStatus(false);
    setRealTimeNotifications([
      { type: "alert", message: "Emergency Alert Resolved" },
      ...realTimeNotifications,
    ]);
    toast.success("Alert resolved");
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setRealTimeNotifications([
      { type: "task", message: `New Message: ${chatMessage}` },
      ...realTimeNotifications,
    ]);
    setChatMessage("");
    toast.success("Message sent");
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const renderRoleSpecificContent = () => {
    switch (mockData.user.role) {
      case "user":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaTasks /> My Care Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUserData.carePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{plan.task}</span>
                      <Badge
                        className={`${
                          plan.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Due: {plan.dueDate}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaPills /> My Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUserData.medications.map((med) => (
                  <div
                    key={med.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">
                        {med.name} - {med.time}
                      </span>
                      <Badge
                        className={`${
                          med.status === "Taken"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {med.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Date: {med.date}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaCalendarAlt /> My Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUserData.appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <p className="text-gray-800">{appt.doctor}</p>
                    <p className="text-sm text-gray-500">
                      {appt.date} at {appt.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <BsGraphUp /> My Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockUserData.healthStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="heartRate" fill="#4ADE80" name="Heart Rate" />
                    <Bar
                      dataKey="bloodPressure"
                      fill="#86EFAC"
                      name="Blood Pressure"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );
      case "caregiver":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaTasks /> Assigned Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCaregiverData.assignedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-800">{task.task}</span>
                        <p className="text-sm text-gray-500">
                          Assigned to: {task.assignedTo}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaExclamationTriangle /> Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCaregiverData.emergencyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-800">
                          {alert.type} - {alert.status}
                        </p>
                        <p className="text-sm text-gray-500">{alert.time}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-400 text-green-500 hover:bg-green-50"
                        onClick={handleResolveAlert}
                        aria-label={`Resolve ${alert.type} alert`}
                      >
                        Resolve Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      case "family_member":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <BsGraphUp /> Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockFamilyMemberData.healthStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="heartRate" fill="#4ADE80" name="Heart Rate" />
                    <Bar
                      dataKey="bloodPressure"
                      fill="#86EFAC"
                      name="Blood Pressure"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                  <FaUsers /> Family Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="mb-4 border-green-400 text-green-500 hover:bg-green-50"
                  aria-label="Invite Member"
                >
                  <FaUserPlus className="mr-2" /> Invite Member
                </Button>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-gray-800">
                    No family members invited yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "admin":
        return (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaChartLine /> Admin Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAdminData.users.map((user) => (
                      <tr key={user.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-100 text-green-800">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:bg-green-50"
                            aria-label={`Edit ${user.name}`}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <div className="text-gray-500">Dashboard Under Development</div>;
    }
  };

  const renderChatPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl p-6 border-l border-gray-200 z-30"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-green-500">
          <FaCommentDots /> Communication Hub
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChatOpen(false)}
          className="text-gray-600 hover:bg-green-50"
          aria-label="Close chat"
        >
          <MdClose size={24} />
        </Button>
      </div>
      <div className="space-y-4 h-[calc(100vh-160px)] overflow-y-auto">
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm font-semibold text-gray-800">Jane Doe</p>
          <p className="text-sm text-gray-600">
            Can you check the medication schedule?
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-800">You</p>
          <p className="text-sm text-gray-600">Sure, I’ll update it now.</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
          aria-label="Type a message"
        />
        <Button
          onClick={handleSendMessage}
          className="bg-green-500 hover:bg-green-600 text-white"
          aria-label="Send message"
        >
          <IoIosSend />
        </Button>
      </div>
    </motion.div>
  );

  const renderNotificationsPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-4 top-16 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200 z-20"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">Notifications</h4>
        <Select
          value={notificationFilter}
          onValueChange={setNotificationFilter}
          aria-label="Filter notifications"
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
            <SelectItem value="alerts">Alerts</SelectItem>
            <SelectItem value="appointments">Appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {realTimeNotifications
          .filter(
            (note) =>
              notificationFilter === "all" || note.type === notificationFilter
          )
          .map((note, idx) => (
            <div
              key={idx}
              className="text-sm text-gray-600 p-2 hover:bg-green-50 rounded flex items-start gap-2"
            >
              {note.type === "task" && <FaTasks className="text-green-500" />}
              {note.type === "alert" && (
                <FaExclamationTriangle className="text-red-500" />
              )}
              {note.type === "appointment" && (
                <FaCalendarAlt className="text-blue-500" />
              )}
              {note.message}
            </div>
          ))}
      </div>
    </motion.div>
  );

  const renderTaskModal = () => (
    <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Task Name"
            value={newTask.taskName}
            onChange={(e) =>
              setNewTask({ ...newTask, taskName: e.target.value })
            }
            aria-label="Task name"
          />
          <Input
            type="date"
            min={format(new Date(), "yyyy-MM-dd")}
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            aria-label="Due date"
          />
          <Select
            value={newTask.assignee}
            onValueChange={(value) =>
              setNewTask({ ...newTask, assignee: value })
            }
            aria-label="Select assignee"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Bob Smith">Bob Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setTaskModalOpen(false)}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white"
            aria-label="Save task"
          >
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderAlertModal = () => (
    <Dialog open={alertModalOpen} onOpenChange={setAlertModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Alert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={newAlert.type}
            onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}
            aria-label="Alert type"
          >
            <SelectTrigger>
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fall Detected">Fall Detected</SelectItem>
              <SelectItem value="Medical Emergency">
                Medical Emergency
              </SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Description"
            value={newAlert.description}
            onChange={(e) =>
              setNewAlert({ ...newAlert, description: e.target.value })
            }
            aria-label="Alert description"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setAlertModalOpen(false)}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAlert}
            className="bg-red-500 hover:bg-red-600 text-white"
            aria-label="Save alert"
          >
            Save Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatOpen(!chatOpen)}
              className="text-gray-600 hover:bg-green-50"
              aria-label="Open Chat"
            >
              <FaCommentDots size={20} />
            </Button>
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
              {notificationsOpen && renderNotificationsPanel()}
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
          </div>
        </motion.header>

        {/* Emergency Alert */}
        {emergencyStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 p-4 rounded-xl flex items-center justify-between gap-4 border border-red-200"
          >
            <div className="flex items-center gap-4">
              <FaExclamationTriangle className="text-red-600" size={24} />
              <p className="text-red-600 font-medium">
                Emergency Alert Active - Please take action
              </p>
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
          </motion.div>
        )}

        {/* Quick Actions */}
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

        {/* Role-Specific Content */}
        {renderRoleSpecificContent()}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(mockData.stats).map(([key, value], i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
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
            </motion.div>
          ))}
        </div>

        {/* Calendar Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-600">
              <FaCalendarAlt /> Schedule Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={date}
              onChange={handleDateChange}
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

        {/* Files & Health Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaFileAlt /> Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="mb-4 border-green-400 text-green-500 hover:bg-green-50"
                aria-label="Upload File"
              >
                <FaFileAlt className="mr-2" /> Upload File
              </Button>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-gray-800">
                  Prescription.pdf - Uploaded on 2025-05-09
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <MdHealthAndSafety /> Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-gray-800">
                  Daily Tip: Ensure hydration by drinking 8 glasses of water
                  daily.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chat & Modals */}
      {chatOpen && renderChatPanel()}
      {taskModalOpen && renderTaskModal()}
      {alertModalOpen && renderAlertModal()}
    </div>
  );
};

export default Dashboard;
