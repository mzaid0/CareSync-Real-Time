import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import apiServices from "../api/apiServices";
import CarePlanForm from "../components/careplan/careplan-form";
import CarePlanList from "../components/careplan/careplan-list";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
import { useAppSelector } from "../store/hooks";

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

const CarePlansPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || "caregiver";
  const userId = user?._id || "";
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch notifications for unread count and recent task_assigned
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiServices.getNotifications,
  });

  // Play sound for notifications
  const playSound = () => {
    const audio = new Audio("/notification.mp3?ts=" + Date.now());
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
    if (notificationsData?.data.notifications) {
      const recentNotifications = notificationsData.data.notifications.filter(
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
  }, [notificationsData, navigate]);

  // Socket.IO event listeners
  useEffect(() => {
    socket.on("careplan:created", () => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
    });
    socket.on("careplan:updated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      if (data.carePlan?._id) {
        queryClient.invalidateQueries({
          queryKey: ["carePlans", data.carePlan._id],
        });
      }
    });
    socket.on("task:updated", (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      if (data.carePlanId) {
        queryClient.invalidateQueries({
          queryKey: ["carePlans", data.carePlanId],
        });
      }
    });
    socket.on("careplan:deleted", (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      if (data.carePlanId) {
        queryClient.invalidateQueries({
          queryKey: ["carePlans", data.carePlanId],
        });
      }
    });
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
        toast.success("New Task Assigned", {
          description: data.message,
          action: {
            label: "View Details",
            onClick: () => navigate(`/care-plans/${data.relatedEntity?.id}`),
          },
          style: {
            background: "#e6ffed",
            border: "1px solid #34d399",
            color: "#065f46",
          },
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    });

    return () => {
      socket.off("careplan:created");
      socket.off("careplan:updated");
      socket.off("task:updated");
      socket.off("careplan:deleted");
      socket.off("task:reminder");
      socket.off("task:assigned");
    };
  }, [queryClient, userId, navigate]);

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({
      carePlanId,
      taskId,
      status,
    }: {
      carePlanId: string;
      taskId: string;
      status: "Pending" | "Completed" | "In Progress";
    }) => apiServices.updateTaskStatus(carePlanId, taskId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      queryClient.invalidateQueries({
        queryKey: ["carePlans", selectedPlan?._id],
      });
      toast.success("Success", {
        description: data.message || "Task status updated successfully!",
        style: { background: "#e6fff5", border: "1px solid #00cc66" },
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to update task status",
        style: { background: "#ffe6e6", border: "1px solid #ff3333" },
      });
    },
  });

  const handleUpdateTaskStatus = (
    carePlanId: string,
    taskId: string,
    status: "Pending" | "Completed" | "In Progress"
  ) => {
    updateTaskStatusMutation.mutate({ carePlanId, taskId, status });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 space-y-8">
        <CarePlanList
          onViewDetails={(plan) => {
            setSelectedPlan(plan);
            setIsDetailOpen(true);
          }}
        />
        <CarePlanForm
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPlan?.title} Details</DialogTitle>
            </DialogHeader>
            {selectedPlan && (
              <div className="space-y-4">
                <p>
                  <strong>Created By:</strong>{" "}
                  {typeof selectedPlan.userId === "string"
                    ? selectedPlan.userId
                    : selectedPlan.userId.name}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {format(new Date(selectedPlan.createdAt), "PPp")}
                </p>
                <h4 className="text-sm font-semibold">Tasks</h4>
                {selectedPlan.tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks assigned.</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedPlan.tasks.map((task) => (
                      <li key={task._id} className="border-b py-2">
                        <p>
                          <strong>Task:</strong> {task.taskName}
                        </p>
                        <p>
                          <strong>Assigned To:</strong>{" "}
                          {typeof task.assignedTo === "string"
                            ? task.assignedTo
                            : task.assignedTo.name}
                        </p>
                        <p>
                          <strong>Due Date:</strong>{" "}
                          {format(new Date(task.dueDate), "PP")}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <Badge
                            className={
                              task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {task.status}
                          </Badge>
                        </p>
                        {(userRole === "caregiver" || userRole === "admin") && (
                          <Select
                            value={task.status}
                            onValueChange={(value) =>
                              handleUpdateTaskStatus(
                                selectedPlan._id,
                                task._id!,
                                value as "Pending" | "Completed" | "In Progress"
                              )
                            }
                          >
                            <SelectTrigger className="w-32 mt-2">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailOpen(false);
                  setSelectedPlan(null);
                }}
                aria-label="Close details"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CarePlansPage;
