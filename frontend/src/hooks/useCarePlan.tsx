import { authService } from "@/api/services/auth-service";
import { careplanService } from "@/api/services/careplan-service";
import type { CarePlan } from "@/types/careplan";
import type { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FormTask {
  taskName: string;
  assignedTo: string;
  dueDate: string;
}

interface FormData {
  title: string;
  tasks: FormTask[];
}

export const useCarePlanManagement = (
  setIsModalOpen: (open: boolean) => void,
  setSelectedPlan: (plan: CarePlan | null) => void,
  setFormData: (data: FormData) => void
) => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await authService.getAllUsers();
      return response.data;
    },
  });

  const { data: carePlans, isLoading } = useQuery<CarePlan[]>({
    queryKey: ["careplans"],
    queryFn: careplanService.getAllCarePlans,
  });

  const createCarePlan = useMutation({
    mutationFn: careplanService.createCarePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careplans"] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateCarePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CarePlan> }) =>
      careplanService.updateCarePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careplans"] });
      setIsModalOpen(false);
      setSelectedPlan(null);
      resetForm();
    },
  });

  const deleteCarePlan = useMutation({
    mutationFn: careplanService.deleteCarePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careplans"] });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ carePlanId, taskId, status }: { carePlanId: string; taskId: string; status: string }) =>
      careplanService.updateTaskStatus(carePlanId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careplans"] });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", tasks: [{ taskName: "", assignedTo: "", dueDate: "" }] });
  };

  return {
    users,
    carePlans,
    isLoading,
    createCarePlan,
    updateCarePlan,
    deleteCarePlan,
    updateTaskStatus,
    resetForm,
  };
};