import { Button } from "@/components/ui/button";
import { useCarePlanManagement } from "@/hooks/useCarePlan";
import type { CarePlan } from "@/types/careplan";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaPlus, FaTasks } from "react-icons/fa";
import DetailModal from "./components/careplan-detail";
import CarePlanList from "./components/careplan-list";
import CreateEditModal from "./components/create-edit-form";

interface FormTask {
  taskName: string;
  assignedTo: string;
  dueDate: string;
}

interface FormData {
  title: string;
  tasks: FormTask[];
}

const CarePlanManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    tasks: [{ taskName: "", assignedTo: "", dueDate: "" }],
  });
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "In Progress" | "Completed">("All");

  const {
    users,
    carePlans,
    isLoading,
    createCarePlan,
    updateCarePlan,
    deleteCarePlan,
    updateTaskStatus,
    resetForm,
  } = useCarePlanManagement(setIsModalOpen, setSelectedPlan, setFormData);

  const handleEdit = (plan: CarePlan) => {
    setSelectedPlan(plan);
    setFormData({
      title: plan.title,
      tasks: plan.tasks.map(task => ({
        taskName: task.taskName,
        assignedTo: task.assignedTo,
        dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      })),
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (plan: CarePlan) => {
    setSelectedPlan(plan);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaTasks className="text-green-400" /> Care Plans
            </h1>
            <p className="text-gray-500 text-sm">Manage your care plans</p>
          </div>
          <Button
            className="bg-green-400 hover:bg-green-500 text-white"
            onClick={() => {
              resetForm();
              setSelectedPlan(null);
              setIsModalOpen(true);
            }}
          >
            <FaPlus className="mr-2" /> New Plan
          </Button>
        </motion.div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaCalendarAlt className="text-green-400" /> Calendar
          </h2>
          <div className="h-32 bg-gray-100 rounded flex items-center justify-center mt-2">
            <p className="text-gray-500">Calendar Placeholder</p>
          </div>
        </div>

        <CarePlanList
          carePlans={carePlans}
          isLoading={isLoading}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          users={users}
          handleEdit={handleEdit}
          handleDelete={deleteCarePlan.mutate}
          handleViewDetails={handleViewDetails}
        />

        <CreateEditModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          users={users}
          selectedPlan={selectedPlan}
          createCarePlan={createCarePlan.mutate}
          updateCarePlan={updateCarePlan.mutate}
          resetForm={resetForm}
        />

        <DetailModal
          isOpen={isDetailOpen}
          setIsOpen={setIsDetailOpen}
          selectedPlan={selectedPlan}
          users={users}
          updateTaskStatus={updateTaskStatus.mutate}
        />
      </main>
    </div>
  );
};

export default CarePlanManagement;