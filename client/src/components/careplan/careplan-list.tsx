import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  FaCalendarAlt,
  FaEdit,
  FaPlus,
  FaTasks,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CustomCalendar from "../custom-calander";
import apiServices from "../../api/apiServices";
import { useAppSelector } from "../../store/hooks";
import { toast } from "sonner";
import CarePlanForm from "./careplan-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CarePlanListProps {
  onViewDetails: (plan: CarePlan) => void;
}

const CarePlanList = ({ onViewDetails }: CarePlanListProps) => {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || "caregiver";
  const userId = user?._id || "";
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Completed" | "In Progress"
  >("All");
  const [sortBy, setSortBy] = useState<"dueDate" | "title">("dueDate");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch care plans
  const {
    data: carePlansData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["carePlans"],
    queryFn: apiServices.getCarePlans,
    retry: 2,
  });

  const carePlans = carePlansData?.carePlans || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: apiServices.deleteCarePlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      toast.success("Success", {
        description: data.message || "Care plan deleted successfully!",
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to delete care plan",
      });
    },
  });

  const handleDeleteCarePlan = (id: string) => {
    if (window.confirm("Are you sure you want to delete this care plan?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Filtering and sorting logic
  const filteredCarePlans = carePlans
    .filter((plan) => {
      if (filterStatus === "All") return true;
      return (
        plan.tasks.length > 0 &&
        plan.tasks.some((task) => task.status === filterStatus)
      );
    })
    .filter((plan) => {
      if (userRole === "caregiver") {
        return plan.tasks.some((task) =>
          typeof task.assignedTo === "string"
            ? task.assignedTo === userId
            : task.assignedTo._id === userId
        );
      }
      if (userRole === "user") {
        return typeof plan.userId === "string"
          ? plan.userId === userId
          : plan.userId._id === userId;
      }
      return true; // Admin/Family sees all
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return (
          new Date(a.tasks[0]?.dueDate || a.createdAt).getTime() -
          new Date(b.tasks[0]?.dueDate || b.createdAt).getTime()
        );
      }
      return a.title.localeCompare(b.title);
    });

  const renderCarePlans = () => {
    if (isLoading) return <p>Loading care plans...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;
    if (filteredCarePlans.length === 0) {
      return <p className="text-gray-500 text-center">No care plans found.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCarePlans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FaTasks className="text-green-500" /> {plan.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Due: {plan.tasks[0]?.dueDate || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaUser className="text-blue-500" /> Created By:{" "}
                    {typeof plan.userId === "string"
                      ? plan.userId
                      : plan.userId.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tasks: {plan.tasks.length}
                  </p>
                  <Badge
                    className={`mt-2 ${
                      plan.tasks.length > 0 &&
                      plan.tasks.every((task) => task.status === "Completed")
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {plan.tasks.length > 0 &&
                    plan.tasks.every((task) => task.status === "Completed")
                      ? "Completed"
                      : "Pending"}
                  </Badge>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-400 text-blue-600 hover:bg-blue-50"
                      onClick={() => onViewDetails(plan)}
                      aria-label={`View details for ${plan.title}`}
                    >
                      View Details
                    </Button>
                    {(userRole === "family_member" || userRole === "admin") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-400 text-green-600 hover:bg-green-50"
                          onClick={() => setIsModalOpen(true)}
                          aria-label={`Edit ${plan.title}`}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCarePlan(plan._id)}
                          aria-label={`Delete ${plan.title}`}
                        >
                          <FaTrash className="mr-2" /> Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FaTasks className="text-green-500" /> Care Plans
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and schedule patient care activities
            </p>
          </div>
          {(userRole === "family_member" || userRole === "admin") && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsModalOpen(true)}
              aria-label="Add new care plan"
            >
              <FaPlus className="mr-2" /> New Care Plan
            </Button>
          )}
        </motion.div>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-600">
              <FaCalendarAlt /> Schedule Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={handleDateChange}
              events={carePlans.flatMap((plan) =>
                plan.tasks.map((task) => ({
                  title: `${plan.title}: ${task.taskName}`,
                  start: new Date(task.dueDate),
                  end: new Date(task.dueDate),
                }))
              )}
              className="w-full"
              aria-label="Care plan schedule calendar"
            />
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Active Plans
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(
                      value as "All" | "Pending" | "Completed" | "In Progress"
                    )
                  }
                >
                  <SelectTrigger
                    className="w-32"
                    aria-label="Filter care plans by status"
                  >
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as "dueDate" | "title")
                  }
                >
                  <SelectTrigger className="w-32" aria-label="Sort care plans">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderCarePlans()}</CardContent>
        </Card>

        <CarePlanForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </main>
    </div>
  );
};

export default CarePlanList;
