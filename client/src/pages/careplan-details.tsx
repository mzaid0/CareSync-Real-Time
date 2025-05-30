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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaClipboardList,
  FaEdit,
  FaPlus,
  FaTasks,
  FaTrash,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomCalendar from "../components/custom-calander"; // Verify this path

// Mock Data (aligned with Care Plan Model, PDF page 8)
interface Task {
  id: number;
  taskName: string;
  assignedTo: string;
  status: "Pending" | "Completed";
  dueDate: string;
  notes?: string;
}

interface CarePlan {
  id: number;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  tasks: Task[];
}

const mockCarePlan: CarePlan = {
  id: 1,
  title: "Weekly Care for John",
  description: "This is a detailed weekly care plan for John Doe.",
  createdBy: "Admin User",
  createdAt: "2025-05-10 10:00",
  tasks: [
    {
      id: 1,
      taskName: "Morning Medication",
      assignedTo: "Caregiver A",
      status: "Completed",
      dueDate: "2025-05-16",
      notes: "Ensure medication is taken with breakfast.",
    },
    {
      id: 2,
      taskName: "Physiotherapy Session",
      assignedTo: "Caregiver B",
      status: "Pending",
      dueDate: "2025-05-17",
      notes: "Session at 3 PM with Dr. Smith.",
    },
  ],
};

const CarePlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [newTask, setNewTask] = useState({
    taskName: "",
    assignedTo: "",
    dueDate: "",
    notes: "",
  });
  const [editedCarePlan, setEditedCarePlan] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCarePlanModalOpen, setIsCarePlanModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Completed"
  >("All");
  const [sortBy, setSortBy] = useState<"taskName" | "dueDate">("dueDate");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [realTimeNotifications, setRealTimeNotifications] = useState<
    { type: "task"; message: string }[]
  >([]);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "admin"
  ); // Mock role

  useEffect(() => {
    // Fetch care plan details from API
    // Example: fetchCarePlanById(id).then(setCarePlan);
    setCarePlan(mockCarePlan); // Mock data for demo
  }, [id]);

  const handleTaskInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCarePlanInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editedCarePlan) return;
    const { name, value } = e.target;
    setEditedCarePlan({ ...editedCarePlan, [name]: value });
  };

  const handleAddTask = () => {
    if (!newTask.taskName || !newTask.assignedTo || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!carePlan) return;
    const newId = carePlan.tasks.length + 1;
    const newTaskData = {
      id: newId,
      ...newTask,
      status: "Pending" as "Pending",
    };
    setCarePlan({
      ...carePlan,
      tasks: [...carePlan.tasks, newTaskData],
    });
    setRealTimeNotifications([
      { type: "task", message: `New Task: ${newTask.taskName}` },
      ...realTimeNotifications,
    ]);
    setIsTaskModalOpen(false);
    setNewTask({ taskName: "", assignedTo: "", dueDate: "", notes: "" });
    toast.success("Task added successfully");
  };

  const handleEditTask = () => {
    if (!selectedTask || !carePlan) return;
    setCarePlan({
      ...carePlan,
      tasks: carePlan.tasks.map((task) =>
        task.id === selectedTask.id ? selectedTask : task
      ),
    });
    setRealTimeNotifications([
      { type: "task", message: `Task Updated: ${selectedTask.taskName}` },
      ...realTimeNotifications,
    ]);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    toast.success("Task updated successfully");
  };

  const handleMarkTaskCompleted = (id: number) => {
    if (!carePlan) return;
    const task = carePlan.tasks.find((t) => t.id === id);
    setCarePlan({
      ...carePlan,
      tasks: carePlan.tasks.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      ),
    });
    setRealTimeNotifications([
      { type: "task", message: `Task Completed: ${task?.taskName}` },
      ...realTimeNotifications,
    ]);
    toast.success("Task marked as completed");
  };

  const handleDeleteTask = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!carePlan || !taskToDelete) return;
    const task = carePlan.tasks.find((t) => t.id === taskToDelete);
    setCarePlan({
      ...carePlan,
      tasks: carePlan.tasks.filter((task) => task.id !== taskToDelete),
    });
    setRealTimeNotifications([
      { type: "task", message: `Task Deleted: ${task?.taskName}` },
      ...realTimeNotifications,
    ]);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
    toast.success("Task deleted successfully");
  };

  const handleEditCarePlan = () => {
    if (!carePlan || !editedCarePlan) return;
    setCarePlan({
      ...carePlan,
      title: editedCarePlan.title,
      description: editedCarePlan.description,
    });
    setIsCarePlanModalOpen(false);
    setEditedCarePlan(null);
    toast.success("Care plan updated successfully");
  };

  const filteredTasks = carePlan?.tasks
    ?.filter((task) => {
      if (filterStatus === "All") return true;
      return task.status === filterStatus;
    })
    ?.filter((task) => {
      if (userRole === "caregiver")
        return task.assignedTo.includes("Caregiver");
      if (userRole === "user") return task.assignedTo.includes("User");
      if (userRole === "family_member") return true; // Read-only
      return true; // Admin sees all
    })
    ?.sort((a, b) => {
      if (sortBy === "taskName") return a.taskName.localeCompare(b.taskName);
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const renderTasks = () => {
    if (!filteredTasks || filteredTasks.length === 0) {
      return <p className="text-gray-500 text-center">No tasks found.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell>{task.taskName}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{task.notes || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userRole !== "family_member" && (
                      <>
                        {task.status === "Pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                            onClick={() => handleMarkTaskCompleted(task.id)}
                            aria-label={`Mark ${task.taskName} as completed`}
                          >
                            <FaCheckCircle />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          aria-label={`Edit ${task.taskName}`}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete ${task.taskName}`}
                        >
                          <FaTrash />
                        </Button>
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
        <h4 className="font-semibold text-gray-800">Recent Task Activities</h4>
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
            className="text-sm text-gray-600 p-2 hover:bg-green-50 rounded flex items-start gap-2"
          >
            <FaTasks className="text-green-500" />
            {note.message}
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (!carePlan) {
    return <div className="p-6">Loading...</div>;
  }

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
                <FaClipboardList className="text-green-500" /> Care Plan Details
              </h1>
              <p className="text-gray-500 mt-1">
                Manage tasks for {carePlan.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/care-plans")}
              className="text-gray-600 hover:bg-green-50"
              aria-label="Back to Care Plans"
            >
              <FaArrowLeft className="mr-2" /> Back to Care Plans
            </Button>
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
            {userRole === "admin" && (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  setEditedCarePlan({
                    title: carePlan.title,
                    description: carePlan.description,
                  });
                  setIsCarePlanModalOpen(true);
                }}
                aria-label="Edit care plan"
              >
                <FaEdit className="mr-2" /> Edit Care Plan
              </Button>
            )}
            {userRole !== "family_member" && (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                aria-label="Add new task"
              >
                <FaPlus className="mr-2" /> Add Task
              </Button>
            )}
          </div>
        </motion.header>

        {/* Care Plan Details */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Care Plan Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-gray-700">Title</h3>
                <p className="text-gray-900">{carePlan.title}</p>
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700">
                  Description
                </h3>
                <Textarea
                  value={carePlan.description}
                  readOnly
                  className="w-full bg-gray-50"
                  aria-label="Care plan description"
                />
              </div>
              <div className="flex gap-8">
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    Created By
                  </h3>
                  <p className="text-gray-900">{carePlan.createdBy}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    Created At
                  </h3>
                  <p className="text-gray-900">{carePlan.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
              <FaCalendarAlt /> Task Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              events={carePlan.tasks.map((task) => ({
                title: task.taskName,
                start: new Date(task.dueDate),
                end: new Date(task.dueDate),
              }))}
              className="w-full"
              aria-label="Task schedule calendar"
            />
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Tasks
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as any)}
                  aria-label="Filter tasks by status"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                  aria-label="Sort tasks"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taskName">Task Name</SelectItem>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderTasks()}</CardContent>
        </Card>
      </main>

      {/* Add/Edit Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task Name"
              name="taskName"
              value={selectedTask?.taskName || newTask.taskName}
              onChange={(e) =>
                selectedTask
                  ? setSelectedTask({
                      ...selectedTask,
                      taskName: e.target.value,
                    })
                  : setNewTask({ ...newTask, taskName: e.target.value })
              }
              aria-label="Task name"
            />
            <Select
              value={selectedTask?.assignedTo || newTask.assignedTo}
              onValueChange={(value) =>
                selectedTask
                  ? setSelectedTask({
                      ...selectedTask,
                      assignedTo: value,
                    })
                  : setNewTask({ ...newTask, assignedTo: value })
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
            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")}
              name="dueDate"
              value={selectedTask?.dueDate || newTask.dueDate}
              onChange={(e) =>
                selectedTask
                  ? setSelectedTask({
                      ...selectedTask,
                      dueDate: e.target.value,
                    })
                  : setNewTask({ ...newTask, dueDate: e.target.value })
              }
              aria-label="Due date"
            />
            <Textarea
              placeholder="Notes (optional)"
              name="notes"
              value={selectedTask?.notes || newTask.notes}
              onChange={(e) =>
                selectedTask
                  ? setSelectedTask({
                      ...selectedTask,
                      notes: e.target.value,
                    })
                  : setNewTask({ ...newTask, notes: e.target.value })
              }
              aria-label="Task notes"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsTaskModalOpen(false);
                setSelectedTask(null);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={selectedTask ? handleEditTask : handleAddTask}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label={selectedTask ? "Save changes" : "Add task"}
            >
              {selectedTask ? "Save Changes" : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Care Plan Modal */}
      <Dialog open={isCarePlanModalOpen} onOpenChange={setIsCarePlanModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Care Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Care Plan Title"
              name="title"
              value={editedCarePlan?.title || ""}
              onChange={handleCarePlanInputChange}
              aria-label="Care plan title"
            />
            <Textarea
              placeholder="Description"
              name="description"
              value={editedCarePlan?.description || ""}
              onChange={handleCarePlanInputChange}
              aria-label="Care plan description"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCarePlanModalOpen(false);
                setEditedCarePlan(null);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCarePlan}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Save changes"
            >
              Save Changes
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
          <p>Are you sure you want to delete this task?</p>
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

export default CarePlanDetailPage;
