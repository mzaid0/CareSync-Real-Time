// types.ts
export interface User {
  name: string;
  role: "user" | "caregiver" | "family_member" | "admin";
  avatar: string;
}

export interface CarePlan {
  id: number;
  task: string;
  status: "Pending" | "Completed";
  progress: number;
  dueDate: string;
}

export interface Medication {
  id: number;
  name: string;
  time: string;
  status: "Taken" | "Pending";
  date: string;
}

export interface Appointment {
  id: number;
  doctor: string;
  time: string;
  date: string;
}

export interface HealthStatus {
  time: string;
  heartRate: number;
  bloodPressure: number;
}

export interface AssignedTask {
  id: number;
  task: string;
  status: "Pending" | "Completed";
  assignedTo: string;
  dueDate: string;
}

export interface EmergencyAlert {
  id: number;
  type: string;
  status: string;
  time: string;
}

export interface AdminUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

export interface Notification {
  type: "task" | "alert" | "appointment";
  message: string;
}