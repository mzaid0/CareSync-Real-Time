import axiosInstance from "../axios-instance";
import type { LoginPayload, RegisterPayload, ApiResponse, User } from "../../types/user"

const authService = {
    register: async (userData: RegisterPayload): Promise<ApiResponse<User>> => {
        const response = await axiosInstance.post("/api/users/register", userData);
        return response.data;
    },

    login: async (credentials: LoginPayload): Promise<ApiResponse<User>> => {
        const response = await axiosInstance.post("/api/users/login", credentials);
        return response.data;
    }
};

export default authService;
