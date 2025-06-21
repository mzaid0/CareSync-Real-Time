import type {
  User,
  CarePlan,
  Medication,
  Appointment,
  HealthStatus,
  AssignedTask,
  EmergencyAlert,
  AdminUser,
} from "@/types/types";

export const mockUser: User = {
  name: "John Doe",
  role: "user",
  avatar: "/avatar.png",
};

export const mockStats = {
  care_plans: 8,
  appointments: 5,
  medications: 12,
  alerts: 2,
};

export const carePlans: CarePlan[] = [
  {
    id: 1,
    task: "Take morning medication",
    status: "Pending",
    progress: 50,
    dueDate: "2025-05-18",
  },
  {
    id: 2,
    task: "Attend physical therapy",
    status: "Completed",
    progress: 100,
    dueDate: "2025-05-15",
  },
];

export const medications: Medication[] = [
  {
    id: 1,
    name: "Aspirin",
    time: "08:00",
    status: "Taken",
    date: "2025-05-18",
  },
  {
    id: 2,
    name: "Insulin",
    time: "12:00",
    status: "Pending",
    date: "2025-05-18",
  },
];

export const appointments: Appointment[] = [
  { id: 1, doctor: "Dr. Smith", time: "14:00", date: "2025-05-18" },
];

export const healthStatus: HealthStatus[] = [
  { time: "08:00", heartRate: 72, bloodPressure: 120 },
  { time: "12:00", heartRate: 75, bloodPressure: 122 },
  { time: "16:00", heartRate: 70, bloodPressure: 118 },
];

export const assignedTasks: AssignedTask[] = [
  {
    id: 1,
    task: "Assist with morning routine",
    status: "Pending",
    assignedTo: "Jane Doe",
    dueDate: "2025-05-18",
  },
  {
    id: 2,
    task: "Prepare lunch",
    status: "Completed",
    assignedTo: "John Doe",
    dueDate: "2025-05-15",
  },
];

export const emergencyAlerts: EmergencyAlert[] = [
  { id: 1, type: "Fall Detected", status: "Active", time: "2025-05-10 10:00" },
];

export const adminUsers: AdminUser[] = [
  { id: 1, name: "Jane Doe", role: "user", email: "jane@example.com" },
  { id: 2, name: "Bob Smith", role: "caregiver", email: "bob@example.com" },
];
