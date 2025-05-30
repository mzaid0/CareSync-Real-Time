import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaEdit,
  FaPills,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import CustomCalendar from "../components/custom-calander";

// Mock Data (aligned with Medication Model, PDF page 8)
interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  date: string;
  status: "Pending" | "Taken";
  assignedTo: string;
}

const mockMedications: Medication[] = [
  {
    id: 1,
    name: "Aspirin",
    dosage: "100mg",
    frequency: "Daily",
    time: "08:00",
    date: "2025-05-18",
    status: "Pending",
    assignedTo: "Caregiver A",
  },
  {
    id: 2,
    name: "Insulin",
    dosage: "10 units",
    frequency: "Twice Daily",
    time: "12:00",
    date: "2025-05-18",
    status: "Taken",
    assignedTo: "Caregiver B",
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Daily",
    time: "18:00",
    date: "2025-05-18",
    status: "Pending",
    assignedTo: "Caregiver A",
  },
];

const MedicationPage = () => {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    date: "",
    assignedTo: "",
  });
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<number | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Taken">(
    "All"
  );
  const [sortBy, setSortBy] = useState<"name" | "time">("name");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "caregiver"
  ); // Mock role

  useEffect(() => {
    // Fetch medications from API
    // setMedications(await fetchMedications());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedication({ ...newMedication, [name]: value });
  };

  const handleAddMedication = () => {
    if (
      !newMedication.name ||
      !newMedication.dosage ||
      !newMedication.frequency ||
      !newMedication.time ||
      !newMedication.date ||
      !newMedication.assignedTo
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    const newId = medications.length + 1;
    setMedications([
      ...medications,
      {
        id: newId,
        ...newMedication,
        status: "Pending",
      },
    ]);
    setIsModalOpen(false);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      date: "",
      assignedTo: "",
    });
    toast.success("Medication added successfully");
  };

  const handleEditMedication = () => {
    if (!selectedMedication) return;
    setMedications(
      medications.map((med) =>
        med.id === selectedMedication.id ? selectedMedication : med
      )
    );
    setIsModalOpen(false);
    setSelectedMedication(null);
    toast.success("Medication updated successfully");
  };

  const handleDeleteMedication = (id: number) => {
    setMedicationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (medicationToDelete) {
      setMedications(
        medications.filter((med) => med.id !== medicationToDelete)
      );
      setIsDeleteDialogOpen(false);
      setMedicationToDelete(null);
      toast.success("Medication deleted successfully");
    }
  };

  const handleMarkAsTaken = (id: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, status: "Taken" } : med
      )
    );
    toast.success("Medication marked as taken");
  };

  const filteredMedications = medications
    .filter((med) => {
      if (filterStatus === "All") return true;
      return med.status === filterStatus;
    })
    .filter((med) => {
      if (userRole === "caregiver") return med.assignedTo.includes("Caregiver");
      if (userRole === "user") return med.assignedTo.includes("User");
      if (userRole === "family_member") return true; // Read-only
      return true; // Admin sees all
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.time.localeCompare(b.time);
    });

  const renderMedications = () => {
    if (filteredMedications.length === 0) {
      return <p className="text-gray-500 text-center">No medications found.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Medicine Name</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredMedications.map((med) => (
                <motion.tr
                  key={med.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell>{med.time}</TableCell>
                  <TableCell>{med.date}</TableCell>
                  <TableCell>{med.assignedTo}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        med.status === "Taken"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {med.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userRole !== "family_member" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                          onClick={() => {
                            setSelectedMedication(med);
                            setIsModalOpen(true);
                          }}
                          aria-label={`Edit ${med.name}`}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteMedication(med.id)}
                          aria-label={`Delete ${med.name}`}
                        >
                          <FaTrash />
                        </Button>
                        {med.status === "Pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-400 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleMarkAsTaken(med.id)}
                            aria-label={`Mark ${med.name} as taken`}
                          >
                            Mark as Taken
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:bg-green-50"
              aria-label="Open sidebar"
            >
              <FaChevronRight size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaPills className="text-green-500" /> Medication Tracker
              </h1>
              <p className="text-gray-500 mt-1">
                Manage patient medication schedules
              </p>
            </div>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => {
              setSelectedMedication(null);
              setIsModalOpen(true);
            }}
            aria-label="Add new medication"
          >
            <FaPlus className="mr-2" /> Add Medication
          </Button>
        </motion.header>

        {/* Calendar Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
              <FaCalendarAlt /> Medication Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              events={medications.map((med) => ({
                title: `${med.name} at ${med.time}`,
                start: new Date(med.date),
                end: new Date(med.date),
              }))}
              className="w-full"
              aria-label="Medication schedule calendar"
            />
          </CardContent>
        </Card>

        {/* Medications List */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Active Medications
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as any)}
                  aria-label="Filter medications by status"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Taken">Taken</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                  aria-label="Sort medications"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderMedications()}</CardContent>
        </Card>
      </main>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedMedication ? "Edit Medication" : "Add New Medication"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Medicine Name"
              name="name"
              value={selectedMedication?.name || newMedication.name}
              onChange={(e) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      name: e.target.value,
                    })
                  : setNewMedication({ ...newMedication, name: e.target.value })
              }
              aria-label="Medicine name"
            />
            <Input
              placeholder="Dosage (e.g., 100mg)"
              name="dosage"
              value={selectedMedication?.dosage || newMedication.dosage}
              onChange={(e) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      dosage: e.target.value,
                    })
                  : setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
              }
              aria-label="Dosage"
            />
            <Input
              placeholder="Frequency (e.g., Daily)"
              name="frequency"
              value={selectedMedication?.frequency || newMedication.frequency}
              onChange={(e) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      frequency: e.target.value,
                    })
                  : setNewMedication({
                      ...newMedication,
                      frequency: e.target.value,
                    })
              }
              aria-label="Frequency"
            />
            <Input
              placeholder="Time (e.g., 08:00)"
              name="time"
              value={selectedMedication?.time || newMedication.time}
              onChange={(e) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      time: e.target.value,
                    })
                  : setNewMedication({ ...newMedication, time: e.target.value })
              }
              aria-label="Time"
            />
            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")}
              name="date"
              value={selectedMedication?.date || newMedication.date}
              onChange={(e) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      date: e.target.value,
                    })
                  : setNewMedication({ ...newMedication, date: e.target.value })
              }
              aria-label="Date"
            />
            <Select
              value={selectedMedication?.assignedTo || newMedication.assignedTo}
              onValueChange={(value) =>
                selectedMedication
                  ? setSelectedMedication({
                      ...selectedMedication,
                      assignedTo: value,
                    })
                  : setNewMedication({ ...newMedication, assignedTo: value })
              }
              aria-label="Assign to"
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Caregiver A">Caregiver A</SelectItem>
                <SelectItem value="Caregiver B">Caregiver B</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedMedication(null);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={
                selectedMedication ? handleEditMedication : handleAddMedication
              }
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label={
                selectedMedication ? "Save changes" : "Add medication"
              }
            >
              {selectedMedication ? "Save Changes" : "Add Medication"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this medication?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              aria-label="Confirm deletion"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationPage;
