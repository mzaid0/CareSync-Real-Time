import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import type { CarePlan } from "@/types/careplan";
import type { User } from "@/types/user";
import { FaEdit, FaTrash } from "react-icons/fa";

interface CarePlanListProps {
  carePlans: CarePlan[] | undefined;
  isLoading: boolean;
  filterStatus: "All" | "Pending" | "In Progress" | "Completed";
  setFilterStatus: (status: "All" | "Pending" | "In Progress" | "Completed") => void;
  users: User[] | undefined;
  handleEdit: (plan: CarePlan) => void;
  handleDelete: (id: string) => void;
  handleViewDetails: (plan: CarePlan) => void;
}

const CarePlanList = ({
  carePlans,
  isLoading,
  filterStatus,
  setFilterStatus,
  users,
  handleEdit,
  handleDelete,
  handleViewDetails,
}: CarePlanListProps) => {
  const getUserName = (userId: string) => users?.find(u => u._id === userId)?.name || "Unknown";

  const filteredPlans = carePlans?.filter(plan => {
    if (filterStatus === "All") return true;
    return plan.tasks.some(task => task.status === filterStatus);
  }) ?? [];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Your Plans</h3>
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as "All" | "Pending" | "In Progress" | "Completed")}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : filteredPlans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredPlans.map(plan => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border p-4 rounded-lg shadow hover:bg-gray-50"
              >
                <h4 className="text-md font-semibold">{plan.title}</h4>
                <p className="text-sm text-gray-500">
                  Due: {plan.tasks[0] ? new Date(plan.tasks[0].dueDate).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm text-gray-500">By: {getUserName(plan.userId!)}</p>
                <p className="text-sm text-gray-500">Tasks: {plan.tasks.length}</p>
                <span
                  className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                    plan.tasks.some(t => t.status !== "Completed")
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {plan.tasks.some(t => t.status !== "Completed") ? "Pending" : "Completed"}
                </span>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(plan)}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                    <FaEdit className="text-green-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this care plan?")) {
                        handleDelete(plan._id!);
                      }
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CarePlanList;