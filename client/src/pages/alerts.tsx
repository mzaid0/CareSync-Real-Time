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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaChevronRight,
  FaEdit,
  FaExclamationTriangle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import CustomCalendar from "../components/custom-calander";

// Mock Data (aligned with Emergency Alert Model, PDF page 8)
interface EmergencyAlert {
  id: number;
  type: string;
  description: string;
  status: "Active" | "Resolved";
  time: string;
  assignedTo: string;
  priority: "High" | "Low";
}

const mockAlerts: EmergencyAlert[] = [
  {
    id: 1,
    type: "Fall Detected",
    description: "Patient fell in the bathroom",
    status: "Active",
    time: "2025-05-16 08:00",
    assignedTo: "Caregiver A",
    priority: "High",
  },
  {
    id: 2,
    type: "Medical Emergency",
    description: "High heart rate detected",
    status: "Resolved",
    time: "2025-05-15 12:00",
    assignedTo: "Caregiver B",
    priority: "High",
  },
  {
    id: 3,
    type: "General Alert",
    description: "Patient needs assistance",
    status: "Active",
    time: "2025-05-16 10:00",
    assignedTo: "Caregiver A",
    priority: "Low",
  },
];

const EmergencyAlertsPage = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(mockAlerts);
  const [newAlert, setNewAlert] = useState({
    type: "",
    description: "",
    assignedTo: "",
    priority: "Low" as "High" | "Low",
  });
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Resolved"
  >("All");
  const [filterPriority, setFilterPriority] = useState<"All" | "High" | "Low">(
    "All"
  );
  const [sortBy, setSortBy] = useState<"type" | "time">("time");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [realTimeNotifications, setRealTimeNotifications] = useState<
    { type: "alert"; message: string }[]
  >([]);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "caregiver"
  ); // Mock role

  useEffect(() => {
    // Fetch alerts from API
    // setAlerts(await fetchEmergencyAlerts());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAlert({ ...newAlert, [name]: value });
  };

  const handleAddAlert = () => {
    if (!newAlert.type || !newAlert.description || !newAlert.assignedTo) {
      toast.error("Please fill in all fields");
      return;
    }
    const newId = alerts.length + 1;
    const newAlertData = {
      id: newId,
      ...newAlert,
      status: "Active" as "Active",
      time: format(new Date(), "yyyy-MM-dd HH:mm"),
    };
    setAlerts([...alerts, newAlertData]);
    setRealTimeNotifications([
      { type: "alert", message: `New Alert: ${newAlert.type}` },
      ...realTimeNotifications,
    ]);
    setIsModalOpen(false);
    setNewAlert({ type: "", description: "", assignedTo: "", priority: "Low" });
    toast.success("Alert created successfully");
  };

  const handleEditAlert = () => {
    if (!selectedAlert) return;
    setAlerts(
      alerts.map((alert) =>
        alert.id === selectedAlert.id ? selectedAlert : alert
      )
    );
    setRealTimeNotifications([
      { type: "alert", message: `Alert Updated: ${selectedAlert.type}` },
      ...realTimeNotifications,
    ]);
    setIsModalOpen(false);
    setSelectedAlert(null);
    toast.success("Alert updated successfully");
  };

  const handleResolveAlert = (id: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, status: "Resolved" } : alert
      )
    );
    setRealTimeNotifications([
      {
        type: "alert",
        message: `Alert Resolved: ${alerts.find((a) => a.id === id)?.type}`,
      },
      ...realTimeNotifications,
    ]);
    toast.success("Alert resolved successfully");
  };

  const handleDeleteAlert = (id: number) => {
    setAlertToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (alertToDelete) {
      setAlerts(alerts.filter((alert) => alert.id !== alertToDelete));
      setRealTimeNotifications([
        {
          type: "alert",
          message: `Alert Deleted: ${
            alerts.find((a) => a.id === alertToDelete)?.type
          }`,
        },
        ...realTimeNotifications,
      ]);
      setIsDeleteDialogOpen(false);
      setAlertToDelete(null);
      toast.success("Alert deleted successfully");
    }
  };

  const filteredAlerts = alerts
    .filter((alert) => {
      if (filterStatus === "All") return true;
      return alert.status === filterStatus;
    })
    .filter((alert) => {
      if (filterPriority === "All") return true;
      return alert.priority === filterPriority;
    })
    .filter((alert) => {
      if (userRole === "caregiver")
        return alert.assignedTo.includes("Caregiver");
      if (userRole === "user") return alert.assignedTo.includes("User");
      if (userRole === "family_member") return alert.priority === "High"; // Only high-priority for family
      return true; // Admin sees all
    })
    .sort((a, b) => {
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

  const renderAlerts = () => {
    if (filteredAlerts.length === 0) {
      return <p className="text-gray-500 text-center">No alerts found.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>{alert.time}</TableCell>
                  <TableCell>{alert.assignedTo}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        alert.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {alert.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        alert.status === "Active"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userRole !== "family_member" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                          onClick={() => {
                            setSelectedAlert(alert);
                            setIsModalOpen(true);
                          }}
                          aria-label={`Edit ${alert.type}`}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteAlert(alert.id)}
                          aria-label={`Delete ${alert.type}`}
                        >
                          <FaTrash />
                        </Button>
                        {alert.status === "Active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-400 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleResolveAlert(alert.id)}
                            aria-label={`Resolve ${alert.type}`}
                          >
                            Resolve
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderNotificationsPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-4 top-16 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200 z-20"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">Recent Alerts</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNotificationsOpen(false)}
          className="text-gray-600 hover:bg-green-50"
          aria-label="Close notifications"
        >
          <MdClose size={20} />
        </Button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {realTimeNotifications.map((note, idx) => (
          <div
            key={idx}
            className="text-sm text-gray-600 p-2 hover:bg-red-50 rounded flex items-start gap-2"
          >
            <FaExclamationTriangle className="text-red-500" />
            {note.message}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:bg-green-50"
              aria-label="Open sidebar"
            >
              <FaChevronRight size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Emergency
                Alerts
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and respond to critical alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="text-gray-600 hover:bg-green-50"
                aria-label="Open notifications"
              >
                <FaBell size={20} />
              </Button>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white">
                {realTimeNotifications.length}
              </Badge>
              {notificationsOpen && renderNotificationsPanel()}
            </div>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                setSelectedAlert(null);
                setIsModalOpen(true);
              }}
              aria-label="Send new alert"
            >
              <FaPlus className="mr-2" /> Send Alert
            </Button>
          </div>
        </motion.header>

        {/* Calendar Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
              <FaCalendarAlt /> Alert Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              events={alerts.map((alert) => ({
                title: `${alert.type}`,
                start: new Date(alert.time.split(" ")[0]),
                end: new Date(alert.time.split(" ")[0]),
              }))}
              className="w-full"
              aria-label="Alert timeline calendar"
            />
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Active Alerts
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as any)}
                  aria-label="Filter alerts by status"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterPriority}
                  onValueChange={(value) => setFilterPriority(value as any)}
                  aria-label="Filter alerts by priority"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                  aria-label="Sort alerts"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderAlerts()}</CardContent>
        </Card>
      </main>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAlert ? "Edit Alert" : "Send New Alert"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Alert Type (e.g., Fall Detected)"
              name="type"
              value={selectedAlert?.type || newAlert.type}
              onChange={(e) =>
                selectedAlert
                  ? setSelectedAlert({
                      ...selectedAlert,
                      type: e.target.value,
                    })
                  : setNewAlert({ ...newAlert, type: e.target.value })
              }
              aria-label="Alert type"
            />
            <Input
              placeholder="Description"
              name="description"
              value={selectedAlert?.description || newAlert.description}
              onChange={(e) =>
                selectedAlert
                  ? setSelectedAlert({
                      ...selectedAlert,
                      description: e.target.value,
                    })
                  : setNewAlert({ ...newAlert, description: e.target.value })
              }
              aria-label="Alert description"
            />
            <Select
              value={selectedAlert?.assignedTo || newAlert.assignedTo}
              onValueChange={(value) =>
                selectedAlert
                  ? setSelectedAlert({
                      ...selectedAlert,
                      assignedTo: value,
                    })
                  : setNewAlert({ ...newAlert, assignedTo: value })
              }
              aria-label="Assign to"
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Caregiver A">Caregiver A</SelectItem>
                <SelectItem value="Caregiver B">Caregiver B</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedAlert?.priority || newAlert.priority}
              onValueChange={(value) =>
                selectedAlert
                  ? setSelectedAlert({
                      ...selectedAlert,
                      priority: value as "High" | "Low",
                    })
                  : setNewAlert({
                      ...newAlert,
                      priority: value as "High" | "Low",
                    })
              }
              aria-label="Priority"
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedAlert(null);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={selectedAlert ? handleEditAlert : handleAddAlert}
              className="bg-red-500 hover:bg-red-600 text-white"
              aria-label={selectedAlert ? "Save changes" : "Send alert"}
            >
              {selectedAlert ? "Save Changes" : "Send Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this alert?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              aria-label="Confirm deletion"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyAlertsPage;
