import { HeartHandshake, CalendarCheck, Users, Bell } from "lucide-react";

export const FEATURES = [
  {
    icon: HeartHandshake,
    label: "Team Collaboration",
  },
  {
    icon: CalendarCheck,
    label: "Smart Scheduling",
  },
  {
    icon: Users,
    label: "Role Management",
  },
  {
    icon: Bell,
    label: "Real-time Alerts",
  },
];

export const features: Feature[] = [
  {
    iconKey: "FaTasks",
    title: "Care Plans",
    description: "Create and manage personalized care plans with tasks and schedules.",
    benefit: "Streamlines caregiving for patients and families.",
  },
  {
    iconKey: "FaCalendarAlt",
    title: "Appointments",
    description: "Schedule and track appointments with calendar integration.",
    benefit: "Never miss a doctor visit or therapy session.",
  },
  {
    iconKey: "FaPills",
    title: "Medications",
    description: "Manage medication schedules and track adherence.",
    benefit: "Ensures timely medication with alerts.",
  },
  {
    iconKey: "FaExclamationTriangle",
    title: "Emergency Alerts",
    description: "Receive and resolve critical alerts for urgent care needs.",
    benefit: "Quick response to health emergencies.",
  },
  {
    iconKey: "FaFileAlt",
    title: "Files",
    description: "Store and access medical reports and documents securely.",
    benefit: "Centralized document management.",
  },
  {
    iconKey: "FaBell",
    title: "Notifications",
    description: "Stay updated with real-time alerts and messages.",
    benefit: "Keeps everyone in the loop.",
  },
  {
    iconKey: "FaUsers",
    title: "Family Sharing",
    description: "Invite family members to collaborate on care plans.",
    benefit: "Brings families together for shared caregiving.",
  },
  {
    iconKey: "FaSearch",
    title: "Global Search",
    description: "Find care plans, appointments, and more with powerful search.",
    benefit: "Quick access to all your data.",
  },
];

export interface Feature {
  iconKey: string;
  title: string;
  description: string;
  benefit: string;
}