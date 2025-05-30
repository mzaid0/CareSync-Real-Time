import axiosInstance from "./axiosInstance";
import type {
  LoginPayload,
  RegisterPayload,
  User,
  ApiResponse,
} from "../types/user";
import type { CarePlanFormValues } from "../validator/careplan-zod";

const apiServices = {
  register: async (userData: RegisterPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<User>>(
        "/api/users/register",
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to register");
    }
  },

  login: async (credentials: LoginPayload): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<User>>(
        "/api/users/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to login");
    }
  },

  getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<{ users: User[] }>>(
        "/api/users"
      );
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch users");
    }
  },

  getCarePlans: async (): Promise<CarePlanListResponse> => {
    try {
      const response = await axiosInstance.get<CarePlanListResponse>(
        "/api/care-plans"
      );
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch care plans");
    }
  },
  getCarePlanById: async (
    id: string
  ): Promise<ApiResponse<{ carePlan: CarePlan }>> => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<{ carePlan: CarePlan }>
      >(`/api/care-plans/${id}`);
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to fetch care plan");
    }
  },

  createCarePlan: async (
    carePlanData: CarePlanFormValues
  ): Promise<ApiResponse<{ carePlan: CarePlan }>> => {
    try {
      const response = await axiosInstance.post<
        ApiResponse<{ carePlan: CarePlan }>
      >("/api/care-plans", carePlanData);
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to create care plan");
    }
  },

  updateCarePlan: async (
    id: string,
    carePlanData: { title?: string }
  ): Promise<ApiResponse<{ carePlan: CarePlan }>> => {
    try {
      const response = await axiosInstance.put<
        ApiResponse<{ carePlan: CarePlan }>
      >(`/api/care-plans/${id}`, carePlanData);
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to update care plan");
    }
  },

  updateTaskStatus: async (
    carePlanId: string,
    taskId: string,
    status: "Pending" | "Completed" | "In Progress"
  ): Promise<ApiResponse<{ task: Task }>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<{ task: Task }>>(
        `/api/care-plans/${carePlanId}/tasks/${taskId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to update task status"
      );
    }
  },

  deleteCarePlan: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/care-plans/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message || "Failed to delete care plan");
    }
  },

  getNotifications: async (): Promise<
    ApiResponse<{ notifications: Notification[] }>
  > => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<{ notifications: Notification[] }>
      >("/api/notifications");
      return response.data;
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to fetch notifications"
      );
    }
  },

  markNotificationAsRead: async (
    id: string
  ): Promise<ApiResponse<{ notification: Notification }>> => {
    try {
      const response = await axiosInstance.put<
        ApiResponse<{ notification: Notification }>
      >(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to mark notification as read"
      );
    }
  },

  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/notifications/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to delete notification"
      );
    }
  },
};

export default apiServices;
