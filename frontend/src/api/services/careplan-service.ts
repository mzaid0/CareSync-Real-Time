import type { CarePlan } from "@/types/careplan";
import axiosInstance from "../axios-instance";


export const careplanService = {
    getAllCarePlans: async (): Promise<CarePlan[]> => {
        const response = await axiosInstance.get("/api/care-plans");
        return response.data;
    },
    createCarePlan: async (data: Partial<CarePlan>): Promise<CarePlan> => {
        const response = await axiosInstance.post("/api/care-plans", data);
        return response.data.carePlan;
    },
    updateCarePlan: async (id: string, data: Partial<CarePlan>): Promise<CarePlan> => {
        const response = await axiosInstance.put(`/api/care-plans/${id}`, data);
        return response.data.carePlan;
    },
    deleteCarePlan: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/api/care-plans/${id}`);
    },
    updateTaskStatus: async (carePlanId: string, taskId: string, status: string): Promise<void> => {
        await axiosInstance.patch(`/api/care-plans/${carePlanId}/tasks/${taskId}/status`, { status });
    },
};