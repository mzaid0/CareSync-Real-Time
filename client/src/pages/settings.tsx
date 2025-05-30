import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCog,
  FaSave,
  FaTrash,
  FaFileAlt,
  FaTasks,
  FaPills,
  FaExclamationTriangle,
  FaBell,
  FaCalendarAlt,
  FaChevronRight,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { format } from "date-fns";

// Mock Data (aligned with User Model, PDF page 8)
interface UserData {
  name: string;
  email: string;
  phone: string;
  language: string;
  role: "user" | "caregiver" | "family_member" | "admin";
  address?: string;
  profilePicture?: string;
  notificationPreferences: {
    medication: boolean;
    appointment: boolean;
    emergency: boolean;
    task: boolean;
    delivery: "email" | "sms" | "in-app";
  };
  twoFactorEnabled: boolean;
  assignedPatients?: { id: number; name: string }[];
}

interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
}

const mockUserData: UserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  language: "en",
  role: "admin",
  address: "123 Main St, City, Country",
  profilePicture: "/avatar.png",
  notificationPreferences: {
    medication: true,
    appointment: true,
    emergency: true,
    task: true,
    delivery: "email",
  },
  twoFactorEnabled: false,
  assignedPatients: [
    { id: 1, name: "Jane Smith" },
    { id: 2, name: "Bob Johnson" },
  ],
};

const mockAuditLogs: AuditLog[] = [
  { id: 1, action: "Logged in", timestamp: "2025-05-16 05:00" },
  { id: 2, action: "Updated profile", timestamp: "2025-05-15 14:00" },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>(mockUserData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch user data from API
    // Example: fetchUserData().then(setUserData);
    setUserData(mockUserData); // Mock data for demo
  }, []);

  const validateInputs = () => {
    const newErrors = { name: "", email: "", phone: "", password: "" };
    if (!userData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      newErrors.email = "Invalid email format";
    if (!/^\+?[1-9]\d{1,14}$/.test(userData.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone number";
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.phone;
  };

  const validatePassword = () => {
    if (passwordData.newPassword.length < 8) {
      setErrors({
        ...errors,
        password: "New password must be at least 8 characters",
      });
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ ...errors, password: "Passwords do not match" });
      return false;
    }
    setErrors({ ...errors, password: "" });
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleNotificationToggle = (
    key: keyof UserData["notificationPreferences"]
  ) => {
    setUserData({
      ...userData,
      notificationPreferences: {
        ...userData.notificationPreferences,
        [key]: !userData.notificationPreferences[key],
      },
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      setProfilePicture(file);
      setUserData({ ...userData, profilePicture: URL.createObjectURL(file) });
      toast.success("Profile picture selected");
    } else {
      toast.error("Only PNG and JPG images are allowed");
    }
  };

  const saveSettings = () => {
    if (!validateInputs()) {
      toast.error("Please fix form errors");
      return;
    }
    // Save settings to API
    // Example: saveUserData(userData);
    toast.success("Settings saved successfully");
  };

  const savePassword = () => {
    if (!validatePassword()) return;
    // Update password via API
    // Example: updatePassword(passwordData);
    toast.success("Password updated successfully");
    setIsPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggle2FA = () => {
    setUserData({ ...userData, twoFactorEnabled: !userData.twoFactorEnabled });
    toast.success(`2FA ${userData.twoFactorEnabled ? "disabled" : "enabled"}`);
  };

  const deleteAccount = () => {
    // Delete account via API and notify admins
    // Example: deleteAccount();
    toast.success("Account deleted successfully");
    setIsDeleteDialogOpen(false);
    navigate("/login"); // Redirect to login
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
                <FaUserCog className="text-green-500" /> Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </motion.header>

        {/* Profile Settings */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={userData.profilePicture} />
                  <AvatarFallback className="bg-green-400 text-white text-2xl">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                    aria-label="Upload profile picture"
                  />
                  <Button
                    variant="outline"
                    className="border-green-400 text-green-500 hover:bg-green-50"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile picture"
                  >
                    <FaCamera className="mr-2" /> Change Picture
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    aria-label="Full Name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    aria-label="Email Address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    name="language"
                    value={userData.language}
                    onValueChange={(value) =>
                      setUserData({ ...userData, language: value })
                    }
                    aria-label="Language"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={userData.address || ""}
                    onChange={handleInputChange}
                    placeholder="Address"
                    aria-label="Address"
                  />
                </div>
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={saveSettings}
                aria-label="Save profile settings"
              >
                <FaSave className="mr-2" /> Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "medication", label: "Medication Alerts" },
                  { key: "appointment", label: "Appointment Reminders" },
                  { key: "emergency", label: "Emergency Alerts" },
                  { key: "task", label: "Task Assignments" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Switch
                      id={item.key}
                      checked={
                        userData.notificationPreferences[
                          item.key as keyof UserData["notificationPreferences"]
                        ]
                      }
                      onCheckedChange={() =>
                        handleNotificationToggle(
                          item.key as keyof UserData["notificationPreferences"]
                        )
                      }
                      aria-label={`Toggle ${item.label}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="delivery">Notification Delivery</Label>
                <Select
                  name="delivery"
                  value={userData.notificationPreferences.delivery}
                  onValueChange={(value) =>
                    setUserData({
                      ...userData,
                      notificationPreferences: {
                        ...userData.notificationPreferences,
                        delivery: value as any,
                      },
                    })
                  }
                  aria-label="Notification Delivery"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Delivery Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="in-app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={saveSettings}
                aria-label="Save notification preferences"
              >
                <FaSave className="mr-2" /> Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        {userData.role !== "family_member" && (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <Switch
                    id="twoFactor"
                    checked={userData.twoFactorEnabled}
                    onCheckedChange={toggle2FA}
                    aria-label="Toggle Two-Factor Authentication"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-green-400 text-green-500 hover:bg-green-50"
                  onClick={() => setIsPasswordDialogOpen(true)}
                  aria-label="Change Password"
                >
                  <FaLock className="mr-2" /> Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assigned Patients (Caregiver Only) */}
        {userData.role === "caregiver" && (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Assigned Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.assignedPatients?.length ? (
                <ul className="space-y-2">
                  {userData.assignedPatients.map((patient) => (
                    <li key={patient.id} className="text-gray-700">
                      {patient.name} (ID: {patient.id})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No patients assigned.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Audit Log (Admin Only) */}
        {userData.role === "admin" && (
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

        {/* Account Deletion */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Delete Account"
            >
              <FaTrash className="mr-2" /> Delete Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                aria-label="Current Password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                aria-label="New Password"
                className={errors.password ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                aria-label="Confirm New Password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={savePassword}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Save Password"
            >
              Save Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white"
              aria-label="Confirm Deletion"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
