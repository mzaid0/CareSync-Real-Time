import { differenceInHours, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaGoogle,
  FaMapMarkerAlt,
  FaMicrosoft,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUserMd,
} from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "react-toastify";
import CustomCalendar from "../components/custom-calander";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Appointment {
  id: number;
  doctor: string;
  location: string;
  time: string;
  date: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  lat?: number;
  lng?: number;
}
const getStatusStyle = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-green-400/20 text-green-700";
    case "Completed":
      return "bg-gray-200 text-gray-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};


const Map = ({ appointments }: { appointments: Appointment[] }) => {
  const defaultCenter: [number, number] = [51.505, -0.09];
  const validAppointments = appointments.filter(
    (app) => typeof app.lat === "number" && typeof app.lng === "number"
  );

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {validAppointments.map((appointment) => (
          <Marker
            key={appointment.id}
            position={[appointment.lat!, appointment.lng!]}
          >
            <Popup className="text-sm">
              <div className="space-y-1">
                <h3 className="font-semibold text-green-600">
                  {appointment.doctor}
                </h3>
                <p className="text-gray-600">{appointment.location}</p>
                <p className="text-gray-500">
                  {format(new Date(appointment.date), "MMM d, yyyy")} ·{" "}
                  {appointment.time}
                </p>
                <Badge
                  className={`text-xs ${getStatusStyle(appointment.status)}`}
                >
                  {appointment.status}
                </Badge>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "Dr. Smith",
      location: "London Health Clinic",
      time: "14:00",
      date: "2025-05-12",
      status: "Scheduled",
      lat: 51.515,
      lng: -0.1,
    },
    {
      id: 2,
      doctor: "Dr. Johnson",
      location: "City Hospital",
      time: "16:00",
      date: "2025-05-15",
      status: "Completed",
      lat: 51.505,
      lng: -0.09,
    },
    {
      id: 3,
      doctor: "Dr. Taylor",
      location: "Wellness Center",
      time: "11:00",
      date: "2025-05-20",
      status: "Scheduled",
      lat: 51.51,
      lng: -0.08,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    location: "",
    time: "",
    date: "",
    status: "Scheduled" as const,
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        toast.error("Failed to load appointments");
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      appointments.forEach((appointment) => {
        const appointmentDate = new Date(
          `${appointment.date}T${appointment.time}`
        );
        const hoursDifference = differenceInHours(appointmentDate, now);
        if (hoursDifference === 24) {
          toast.info(
            `Reminder: Appointment with ${appointment.doctor} tomorrow at ${appointment.time}`
          );
        }
      });
    };
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [appointments]);

  const handleAddAppointment = () => {
    if (
      !newAppointment.doctor ||
      !newAppointment.location ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newId = appointments.length + 1;
    const newApp = {
      id: newId,
      ...newAppointment,
      lat: 51.5 + Math.random() * 0.02,
      lng: -0.1 + Math.random() * 0.02,
    };
    setAppointments((prev) => [...prev, newApp]);
    setIsModalOpen(false);
    setNewAppointment({
      doctor: "",
      location: "",
      time: "",
      date: "",
      status: "Scheduled",
      lat: 0,
      lng: 0,
    });
    toast.success("Appointment added successfully");
  };

  const handleRescheduleSubmit = () => {
    if (!selectedAppointment) return;
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment.id ? selectedAppointment : app
      )
    );
    setIsRescheduleOpen(false);
    toast.success("Appointment updated successfully");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
      toast.success("Appointment deleted successfully");
    }
  };

  const renderAppointments = (statusFilter: string) => {
    const filtered = appointments.filter(
      (app) =>
        (statusFilter === "All" || app.status === statusFilter) &&
        [app.doctor, app.location].some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
      <AnimatePresence>
        {filtered.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="mb-3 shadow-sm hover:shadow-md transition-shadow border-gray-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FaUserMd className="text-green-400" />
                    <CardTitle className="text-base font-semibold">
                      {appointment.doctor}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{appointment.location}</span>
                    <span className="mx-2">·</span>
                    <span>
                      {format(new Date(appointment.date), "MMM d, yyyy")} at{" "}
                      {appointment.time}
                    </span>
                  </div>
                  <Badge
                    className={`text-xs ${getStatusStyle(appointment.status)}`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-sm border-green-400 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsRescheduleOpen(true);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-sm border-red-300 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  const syncWithGoogleCalendar = () => {
    toast.info("Syncing with Google Calendar...");
  };

  const syncWithOutlook = () => {
    toast.info("Syncing with Outlook...");
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FaCalendarAlt className="text-green-400" />
              Appointments
            </h1>
            <p className="text-gray-500 mt-1">
              Manage medical appointments and schedules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search appointments..."
                className="w-48 md:w-64 pl-10 border-gray-300 focus:ring-2 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-400 hover:bg-green-500 text-white"
            >
              <FaPlus className="mr-2" /> New Appointment
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="bg-green-50/50 rounded-lg p-2">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <Tabs defaultValue="all" className="border-b">
              <TabsList className="bg-transparent space-x-4">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-green-400"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="Scheduled"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-green-400"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="Completed"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-green-400"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="all">
                  {renderAppointments("All")}
                </TabsContent>
                <TabsContent value="Scheduled">
                  {renderAppointments("Scheduled")}
                </TabsContent>
                <TabsContent value="Completed">
                  {renderAppointments("Completed")}
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <CustomCalendar
                events={appointments.map((app) => ({
                  title: `${app.doctor} - ${app.location}`,
                  start: new Date(`${app.date}T${app.time}:00`),
                  end: new Date(`${app.date}T${app.time}:00`),
                }))}
                style={{ height: 500 }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-400" />
          Appointment Locations
        </h3>
        <Map appointments={appointments} />
      </motion.div>

      {/* Sync Section */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="border-green-400 text-green-600 hover:bg-green-50"
          onClick={syncWithGoogleCalendar}
        >
          <FaGoogle className="mr-2" /> Google Calendar
        </Button>
        <Button
          variant="outline"
          className="border-green-400 text-green-600 hover:bg-green-50"
          onClick={syncWithOutlook}
        >
          <FaMicrosoft className="mr-2" /> Outlook
        </Button>
      </div>

      {/* Add Appointment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FaPlus /> New Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Doctor Name"
              className="focus:ring-green-400"
              value={newAppointment.doctor}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, doctor: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              className="focus:ring-green-400"
              value={newAppointment.location}
              onChange={(e) =>
                setNewAppointment({
                  ...newAppointment,
                  location: e.target.value,
                })
              }
            />
            <Input
              type="time"
              className="focus:ring-green-400"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, time: e.target.value })
              }
            />
            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")}
              className="focus:ring-green-400"
              value={newAppointment.date}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, date: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-400 hover:bg-green-500 text-white"
              onClick={handleAddAppointment}
            >
              Create Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <FaCalendarAlt className="text-green-400" /> Reschedule
              Appointment
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <Input
                placeholder="Doctor Name"
                className="focus:ring-green-400"
                value={selectedAppointment.doctor}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    doctor: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Location"
                className="focus:ring-green-400"
                value={selectedAppointment.location}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    location: e.target.value,
                  })
                }
              />
              <Input
                type="time"
                className="focus:ring-green-400"
                value={selectedAppointment.time}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    time: e.target.value,
                  })
                }
              />
              <Input
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                className="focus:ring-green-400"
                value={selectedAppointment.date}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    date: e.target.value,
                  })
                }
              />
              <select
                value={selectedAppointment.status}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    status: e.target.value as
                      | "Scheduled"
                      | "Completed"
                      | "Cancelled",
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => setIsRescheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-400 hover:bg-green-500 text-white"
              onClick={handleRescheduleSubmit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentPage;
