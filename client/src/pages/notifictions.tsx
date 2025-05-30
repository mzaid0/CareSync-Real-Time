import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomCalendar from "../components/custom-calander";
import apiServices from "../api/apiServices";
import { useAppSelector } from "../store/hooks";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Initialize Socket.IO client
const socket: Socket = io(
  import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:5001",
  {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
);

const NotificationsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || "caregiver";
  const userId = user?._id || "";

  const [filterType, setFilterType] = useState<
    | "All"
    | "task_reminder"
    | "careplan_added"
    | "careplan_updated"
    | "task_assigned"
  >("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Read" | "Unread">(
    "All"
  );
  const [sortBy, setSortBy] = useState<"createdAt" | "type">("createdAt");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Fetch notifications
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiServices.getNotifications,
  });

  const notifications: Notification[] = data?.data.notifications || [];

  // Play sound for notifications
  const playSound = () => {
    const audio = new Audio("/notification-sound.mp3");
    audio.play().catch((err) => console.error("Audio play error:", err));
  };

  // Join user room on connect
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id, "User:", userId);
      socket.emit("join", userId);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [userId]);

  // Show recent task_assigned notifications on page load
  useEffect(() => {
    if (data?.data.notifications) {
      const recentNotifications = data.data.notifications.filter(
        (notif: Notification) =>
          !notif.read &&
          notif.type === "task_assigned" &&
          new Date(notif.createdAt) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      );
      recentNotifications.forEach((notif: Notification) => {
        playSound();
        toast.info("New Task Assigned", {
          description: notif.message,
          action: {
            label: "View Details",
            onClick: () => navigate(`/care-plans/${notif.relatedEntity?.id}`),
          },
          style: { background: "#e6f3ff", border: "1px solid #007bff" },
        });
      });
    }
  }, [data, navigate]);

  // Socket.IO listeners
  useEffect(() => {
    socket.on("task:reminder", (data) => {
      if (data.userId === userId) {
        playSound();
        toast.info("Task Reminder", {
          description: data.message,
          style: { background: "#e6f3ff", border: "1px solid #007bff" },
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    });
    socket.on("task:assigned", (data) => {
      console.log("Received task:assigned event:", data);
      if (data.userId === userId) {
        playSound();
        toast.info("New Task Assigned", {
          description: data.message,
          action: {
            label: "View Details",
            onClick: () => navigate(`/care-plans/${data.relatedEntity?.id}`),
          },
          style: { background: "#e6f3ff", border: "1px solid #007bff" },
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    });
    socket.on("notification:read", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    socket.on("notification:deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.off("task:reminder");
      socket.off("task:assigned");
      socket.off("notification:read");
      socket.off("notification:deleted");
    };
  }, [queryClient, userId, navigate]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: apiServices.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read", {
        style: { background: "#e6fff5", border: "1px solid #00cc66" },
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message,
        style: { background: "#ffe6e6", border: "1px solid #ff3333" },
      });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: apiServices.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted successfully", {
        style: { background: "#e6fff5", border: "1px solid #00cc66" },
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message,
        style: { background: "#ffe6e6", border: "1px solid #ff3333" },
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDeleteNotification = (id: string) => {
    setNotificationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!notificationToDelete) return;
    deleteNotificationMutation.mutate(notificationToDelete);
    setIsDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((notif: Notification) => {
      if (!notif.read) markAsReadMutation.mutate(notif._id);
    });
    toast.success("All notifications marked as read", {
      style: { background: "#e6fff5", border: "1px solid #00cc66" },
    });
  };

  const handleDeleteAllRead = () => {
    notifications.forEach((notif: Notification) => {
      if (notif.read) deleteNotificationMutation.mutate(notif._id);
    });
    toast.success("All read notifications deleted", {
      style: { background: "#e6fff5", border: "1px solid #00cc66" },
    });
  };

  const handleClearAll = () => {
    notifications.forEach((notif: Notification) => {
      deleteNotificationMutation.mutate(notif._id);
    });
    toast.success("All notifications cleared", {
      style: { background: "#e6fff5", border: "1px solid #00cc66" },
    });
  };

  const handleViewDetails = (relatedEntity?: {
    type: "CarePlan" | "Task";
    id: string;
  }) => {
    if (!relatedEntity) return;
    switch (relatedEntity.type) {
      case "CarePlan":
        navigate(`/dashboard/care-plans/${relatedEntity.id}`);
        break;
      case "Task":
        navigate(`/dashboard/care-plans/${relatedEntity.id}`);
        break;
    }
  };

  const filteredNotifications: Notification[] = notifications
    .filter((notif: Notification) => {
      if (filterType === "All") return true;
      return notif.type === filterType;
    })
    .filter((notif: Notification) => {
      if (filterStatus === "All") return true;
      return notif.read === (filterStatus === "Read");
    })
    .filter((notif: Notification) => {
      if (userRole === "caregiver")
        return ["task_reminder", "careplan_added", "task_assigned"].includes(
          notif.type
        );
      if (userRole === "user")
        return ["task_reminder", "careplan_added", "task_assigned"].includes(
          notif.type
        );
      if (userRole === "family_member")
        return ["careplan_added", "careplan_updated"].includes(notif.type);
      return true; // Admin sees all
    })
    .sort((a: Notification, b: Notification) => {
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const unreadCount = notifications.filter(
    (notif: Notification) => !notif.read
  ).length;

  const renderNotifications = () => {
    if (isLoading) return <p>Loading notifications...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;
    if (filteredNotifications.length === 0) {
      return (
        <p className="text-gray-500 text-center">No notifications found.</p>
      );
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Message</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredNotifications.map((notif: Notification) => (
                <motion.tr
                  key={notif._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={notif.read ? "" : "font-semibold"}
                >
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.type.replace("_", " ")}</TableCell>
                  <TableCell>
                    {format(new Date(notif.createdAt), "PPp")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        !notif.read
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {notif.read ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notif.relatedEntity && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 border-blue-400 text-blue-500 hover:bg-blue-50"
                        onClick={() => handleViewDetails(notif.relatedEntity)}
                        aria-label={`View details for ${notif.message}`}
                      >
                        <FaEye />
                      </Button>
                    )}
                    {!notif.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                        onClick={() => handleMarkAsRead(notif._id)}
                        aria-label={`Mark ${notif.message} as read`}
                      >
                        <FaCheckCircle />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteNotification(notif._id)}
                      aria-label={`Delete ${notif.message}`}
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8 space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 hover:bg-green-50"
              aria-label="Open sidebar"
            >
              <FaChevronRight size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaBell className="text-green-500" /> Notifications
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-gray-500 mt-1">
                Stay updated with recent activities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userRole === "admin" && (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleClearAll}
                aria-label="Clear all notifications"
              >
                Clear All
              </Button>
            )}
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleMarkAllAsRead}
              aria-label="Mark all as read"
            >
              Mark All as Read
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteAllRead}
              aria-label="Delete all read notifications"
            >
              Delete All Read
            </Button>
          </div>
        </motion.header>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
              <FaCalendarAlt /> Notification Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              events={notifications.map((notif: Notification) => ({
                title: notif.message,
                start: new Date(notif.createdAt),
                end: new Date(notif.createdAt),
              }))}
              className="w-full"
              aria-label="Notification timeline calendar"
            />
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Notifications
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterType}
                  onValueChange={(value) =>
                    setFilterType(
                      value as
                        | "All"
                        | "task_reminder"
                        | "careplan_added"
                        | "careplan_updated"
                        | "task_assigned"
                    )
                  }
                  aria-label="Filter notifications by type"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="task_reminder">Task Reminder</SelectItem>
                    <SelectItem value="careplan_added">
                      Care Plan Added
                    </SelectItem>
                    <SelectItem value="careplan_updated">
                      Care Plan Updated
                    </SelectItem>
                    <SelectItem value="task_assigned">Task Assigned</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(value as "All" | "Read" | "Unread")
                  }
                  aria-label="Filter notifications by status"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Read">Read</SelectItem>
                    <SelectItem value="Unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as "createdAt" | "type")
                  }
                  aria-label="Sort notifications"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Timestamp</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderNotifications()}</CardContent>
        </Card>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this notification?</p>
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
      </main>
    </div>
  );
};

export default NotificationsPage;
