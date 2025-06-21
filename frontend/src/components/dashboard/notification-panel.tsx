import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaCalendarAlt, FaExclamationTriangle, FaTasks } from "react-icons/fa";

interface Notification {
  type: "task" | "alert" | "appointment";
  message: string;
}

interface NotificationsPanelProps {
  notificationsOpen: boolean;
  notificationFilter: string;
  setNotificationFilter: (filter: string) => void;
  realTimeNotifications: Notification[];
}

export const NotificationsPanel = ({
  notificationsOpen,
  notificationFilter,
  setNotificationFilter,
  realTimeNotifications,
}: NotificationsPanelProps) => {
  if (!notificationsOpen) return null;

  return (
    <div className="absolute right-4 top-16 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200 z-20">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">Notifications</h4>
        <Select value={notificationFilter} onValueChange={setNotificationFilter} aria-label="Filter notifications">
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
            <SelectItem value="alerts">Alerts</SelectItem>
            <SelectItem value="appointments">Appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {realTimeNotifications
          .filter((note) => notificationFilter === "all" || note.type === notificationFilter)
          .map((note, idx) => (
            <div key={idx} className="text-sm text-gray-600 p-2 hover:bg-green-50 rounded flex items-start gap-2">
              {note.type === "task" && <FaTasks className="text-green-400" />}
              {note.type === "alert" && <FaExclamationTriangle className="text-red-500" />}
              {note.type === "appointment" && <FaCalendarAlt className="text-blue-500" />}
              {note.message}
            </div>
          ))}
      </div>
    </div>
  );
};