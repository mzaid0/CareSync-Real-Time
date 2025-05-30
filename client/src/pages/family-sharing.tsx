import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUserPlus,
  FaTrash,
  FaEnvelope,
  FaFileAlt,
  FaTasks,
  FaPills,
  FaExclamationTriangle,
  FaBell,
  FaCog,
  FaCalendarAlt,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { format, addDays } from "date-fns";
import { Label } from "@/components/ui/label";

// Mock Data (aligned with Family Member Model, PDF page 8)
interface FamilyMember {
  id: number;
  name: string;
  email: string;
  role: "family_member" | "caregiver" | "admin";
  status: "active" | "pending";
  inviteExpiry?: string; // For pending invites
  permissions: { carePlanId: number; access: "view" | "edit" }[];
}

interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "family_member",
    status: "active",
    permissions: [{ carePlanId: 1, access: "view" }],
  },
  {
    id: 2,
    name: "Mark Smith",
    email: "mark.smith@example.com",
    role: "family_member",
    status: "pending",
    inviteExpiry: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    permissions: [],
  },
];

const mockAuditLogs: AuditLog[] = [
  { id: 1, action: "Invited Jane Doe", timestamp: "2025-05-16 05:00" },
  { id: 2, action: "Removed Mark Smith", timestamp: "2025-05-15 14:00" },
];

const FamilySharingPage = () => {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(mockFamilyMembers);
  const [newMember, setNewMember] = useState({
    email: "",
    role: "family_member" as "family_member" | "caregiver" | "admin",
  });
  const [permissions, setPermissions] = useState<
    { carePlanId: number; access: "view" | "edit" }[]
  >([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending"
  >("all");
  const [filterRole, setFilterRole] = useState<
    "all" | "family_member" | "caregiver" | "admin"
  >("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "admin"
  ); // Mock role
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    // Fetch family members from API
    // Example: fetchFamilyMembers().then(setFamilyMembers);
    setFamilyMembers(mockFamilyMembers); // Mock data for demo
  }, []);

  const validateEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    if (familyMembers.some((member) => member.email === email)) {
      setEmailError("Email already invited");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
    if (name === "email") validateEmail(value);
  };

  const handlePermissionChange = (
    carePlanId: number,
    access: "view" | "edit"
  ) => {
    setPermissions((prev) =>
      prev.some((p) => p.carePlanId === carePlanId)
        ? prev.map((p) => (p.carePlanId === carePlanId ? { ...p, access } : p))
        : [...prev, { carePlanId, access }]
    );
  };

  const inviteMember = () => {
    if (!validateEmail(newMember.email)) return;
    const newId = familyMembers.length + 1;
    const newMemberEntry: FamilyMember = {
      id: newId,
      name: newMember.email.split("@")[0], // Mock name from email
      email: newMember.email,
      role: newMember.role,
      status: "pending",
      inviteExpiry: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      permissions,
    };
    setFamilyMembers([...familyMembers, newMemberEntry]);
    toast.success(`Invite sent to ${newMember.email}`);
    // Mock sending email
    // Example: sendInviteEmail(newMember.email, newMember.role, permissions);
    setIsInviteModalOpen(false);
    setNewMember({ email: "", role: "family_member" });
    setPermissions([]);
  };

  const resendInvite = (email: string) => {
    // Mock resending email
    // Example: resendInviteEmail(email);
    toast.success(`Invite resent to ${email}`);
  };

  const removeMember = () => {
    if (!memberToRemove) return;
    setFamilyMembers(
      familyMembers.filter((member) => member.id !== memberToRemove)
    );
    toast.success("Member removed successfully");
    setIsRemoveDialogOpen(false);
    setMemberToRemove(null);
  };

  const handleBulkRemove = () => {
    setFamilyMembers([]);
    toast.success("All members removed successfully");
  };

  const savePermissions = () => {
    if (!memberToEdit) return;
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === memberToEdit.id ? { ...member, permissions } : member
      )
    );
    toast.success("Permissions updated successfully");
    setIsPermissionsModalOpen(false);
    setMemberToEdit(null);
    setPermissions([]);
  };

  const filteredMembers = familyMembers
    .filter((member) => {
      if (filterStatus === "all") return true;
      return member.status === filterStatus;
    })
    .filter((member) => {
      if (filterRole === "all") return true;
      return member.role === filterRole;
    })
    .filter((member) => {
      if (userRole === "user") return member.role === "family_member"; // Users see only family members
      if (userRole === "family_member") return true; // Read-only
      return true; // Caregiver/Admin see all
    });

  const renderMembers = () => {
    if (filteredMembers.length === 0) {
      return (
        <p className="text-gray-500 text-center">No family members found.</p>
      );
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="capitalize">
                    {member.role.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {member.status}
                      {member.status === "pending" && member.inviteExpiry
                        ? ` (Expires ${member.inviteExpiry})`
                        : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.permissions.length
                      ? member.permissions
                          .map((p) => `Care Plan ${p.carePlanId}: ${p.access}`)
                          .join(", ")
                      : "None"}
                  </TableCell>
                  <TableCell>
                    {userRole !== "user" && userRole !== "family_member" && (
                      <>
                        {member.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 border-blue-400 text-blue-500 hover:bg-blue-50"
                            onClick={() => resendInvite(member.email)}
                            aria-label={`Resend invite to ${member.email}`}
                          >
                            <FaEnvelope />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                          onClick={() => {
                            setMemberToEdit(member);
                            setPermissions(member.permissions);
                            setIsPermissionsModalOpen(true);
                          }}
                          aria-label={`Edit permissions for ${member.name}`}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setMemberToRemove(member.id);
                            setIsRemoveDialogOpen(true);
                          }}
                          aria-label={`Remove ${member.name}`}
                        >
                          <FaTrash />
                        </Button>
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
                <FaUsers className="text-green-500" /> Family Sharing
              </h1>
              <p className="text-gray-500 mt-1">
                Manage family members and their access
              </p>
            </div>
          </div>
          {userRole === "admin" && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleBulkRemove}
              aria-label="Remove all members"
            >
              Remove All Members
            </Button>
          )}
        </motion.header>

        {/* Invite Section */}
        {(userRole === "caregiver" || userRole === "admin") && (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Invite Family Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setIsInviteModalOpen(true)}
                aria-label="Invite new member"
              >
                <FaUserPlus className="mr-2" /> Invite Member
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Family Members List */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Family Members
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as any)}
                  aria-label="Filter by status"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterRole}
                  onValueChange={(value) => setFilterRole(value as any)}
                  aria-label="Filter by role"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="family_member">Family Member</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderMembers()}</CardContent>
        </Card>

        {/* Audit Log (Admin Only) */}
        {userRole === "admin" && (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockAuditLogs.length ? (
                <ul className="space-y-2">
                  {mockAuditLogs.map((log) => (
                    <li key={log.id} className="text-gray-700">
                      {log.action} - {log.timestamp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No audit logs available.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Invite Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Family Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                name="email"
                value={newMember.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                aria-label="Email Address"
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <Select
              value={newMember.role}
              onValueChange={(value) =>
                setNewMember({ ...newMember, role: value as any })
              }
              aria-label="Role"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family_member">Family Member</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                {userRole === "admin" && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
            <div>
              <Label>Permissions (Care Plans)</Label>
              {[1, 2, 3].map((carePlanId) => (
                <div key={carePlanId} className="flex items-center gap-4 mt-2">
                  <Label htmlFor={`carePlan-${carePlanId}`}>
                    Care Plan {carePlanId}
                  </Label>
                  <Select
                    value={
                      permissions.find((p) => p.carePlanId === carePlanId)
                        ?.access || "none"
                    }
                    onValueChange={(value) =>
                      value !== "none" &&
                      handlePermissionChange(
                        carePlanId,
                        value as "view" | "edit"
                      )
                    }
                    aria-label={`Permissions for Care Plan ${carePlanId}`}
                  >
                    <SelectTrigger
                      id={`carePlan-${carePlanId}`}
                      className="w-32"
                    >
                      <SelectValue placeholder="Access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsInviteModalOpen(false);
                setNewMember({ email: "", role: "family_member" });
                setPermissions([]);
                setEmailError("");
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={inviteMember}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={!!emailError || !newMember.email}
              aria-label="Send Invite"
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this family member?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={removeMember}
              className="bg-red-500 hover:bg-red-600 text-white"
              aria-label="Confirm Removal"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700">
              Permissions for {memberToEdit?.name} ({memberToEdit?.email})
            </p>
            {[1, 2, 3].map((carePlanId) => (
              <div key={carePlanId} className="flex items-center gap-4">
                <Label htmlFor={`edit-carePlan-${carePlanId}`}>
                  Care Plan {carePlanId}
                </Label>
                <Select
                  value={
                    permissions.find((p) => p.carePlanId === carePlanId)
                      ?.access || "none"
                  }
                  onValueChange={(value) =>
                    value !== "none" &&
                    handlePermissionChange(carePlanId, value as "view" | "edit")
                  }
                  aria-label={`Edit permissions for Care Plan ${carePlanId}`}
                >
                  <SelectTrigger
                    id={`edit-carePlan-${carePlanId}`}
                    className="w-32"
                  >
                    <SelectValue placeholder="Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                    <SelectItem value="edit">Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPermissionsModalOpen(false);
                setMemberToEdit(null);
                setPermissions([]);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={savePermissions}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Save Permissions"
            >
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilySharingPage;
