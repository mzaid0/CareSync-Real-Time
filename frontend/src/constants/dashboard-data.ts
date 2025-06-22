export interface CarePlan {
  id: number;
  task: string;
  status: "Completed" | "In Progress" | "Pending";
  progress: number;
  dueDate: string;
}

export interface Medication {
  id: number;
  name: string;
  time: string;
  status: "Taken" | "Missed";
  date: string;
}

export interface Appointment {
  id: number;
  doctor: string;
  date: string;
  time: string;
  specialty: string;
}

export interface HealthStatus {
  time: string;
  heartRate: number;
  bloodPressure: number;
}

export interface ActivityData {
  day: string;
  steps: number;
  distance: number;
}

export interface VitalSign {
  name: string;
  value: number;
  unit: string;
  icon: string;
  trend: "stable" | "normal" | "good";
}

export interface MockStats {
  care_plans: number;
  appointments: number;
  medications: number;
  alerts: number;
}

export interface MockUser {
  name: string;
  role: string;
  lastLogin: string;
}

export const carePlans: CarePlan[] = [
  {
    id: 1,
    task: "Morning Medication",
    status: "Completed",
    progress: 100,
    dueDate: "2025-06-15",
  },
  {
    id: 2,
    task: "Physical Therapy",
    status: "In Progress",
    progress: 65,
    dueDate: "2025-06-20",
  },
  {
    id: 3,
    task: "Doctor Appointment",
    status: "Pending",
    progress: 0,
    dueDate: "2025-06-25",
  },
];

export const medications: Medication[] = [
  {
    id: 1,
    name: "Metformin",
    time: "Morning",
    status: "Taken",
    date: "2025-06-15",
  },
  {
    id: 2,
    name: "Lisinopril",
    time: "Afternoon",
    status: "Missed",
    date: "2025-06-15",
  },
  {
    id: 3,
    name: "Atorvastatin",
    time: "Evening",
    status: "Taken",
    date: "2025-06-15",
  },
];

export const appointments: Appointment[] = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    date: "2025-06-18",
    time: "10:00 AM",
    specialty: "Cardiology",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    date: "2025-06-22",
    time: "2:30 PM",
    specialty: "Neurology",
  },
  {
    id: 3,
    doctor: "Dr. Emily Rodriguez",
    date: "2025-06-28",
    time: "11:15 AM",
    specialty: "General",
  },
];

export const healthStatus: HealthStatus[] = [
  { time: "Mon", heartRate: 72, bloodPressure: 120 },
  { time: "Tue", heartRate: 75, bloodPressure: 122 },
  { time: "Wed", heartRate: 71, bloodPressure: 118 },
  { time: "Thu", heartRate: 74, bloodPressure: 121 },
  { time: "Fri", heartRate: 76, bloodPressure: 124 },
  { time: "Sat", heartRate: 73, bloodPressure: 119 },
  { time: "Sun", heartRate: 70, bloodPressure: 117 },
];

export const activityData: ActivityData[] = [
  { day: "Mon", steps: 5432, distance: 3.2 },
  { day: "Tue", steps: 6210, distance: 3.8 },
  { day: "Wed", steps: 4890, distance: 2.9 },
  { day: "Thu", steps: 7100, distance: 4.3 },
  { day: "Fri", steps: 5800, distance: 3.5 },
  { day: "Sat", steps: 8320, distance: 5.0 },
  { day: "Sun", steps: 4500, distance: 2.7 },
];

export const vitalSigns: VitalSign[] = [
  {
    name: "Heart Rate",
    value: 72,
    unit: "bpm",
    icon: "FaHeartbeat",
    trend: "stable",
  },
  {
    name: "Blood Pressure",
    value: 120,
    unit: "/80 mmHg",
    icon: "BsSpeedometer2",
    trend: "normal",
  },
  { name: "Oxygen", value: 98, unit: "%", icon: "FaHeartbeat", trend: "good" },
  {
    name: "Temperature",
    value: 36.8,
    unit: "°C",
    icon: "BsSpeedometer2",
    trend: "normal",
  },
];

export const mockStats: MockStats = {
  care_plans: 3,
  appointments: 3,
  medications: 3,
  alerts: 1,
};

export const mockUser: MockUser = {
  name: "John Doe",
  role: "user",
  lastLogin: "Today, 08:45 AM",
};

export const COLORS = ["#34D399", "#10B981", "#059669", "#047857"];
