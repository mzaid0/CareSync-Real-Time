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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomCalendar from "../components/custom-calander";

// Mock Data (aligned with File Model, PDF page 8)
interface File {
  id: number;
  name: string;
  type: "PDF" | "Image";
  size: number; // in KB
  dateUploaded: string;
  uploadedBy: string;
  description?: string;
  relatedEntity?: { type: "CarePlan" | "Patient"; id: number };
  url: string;
}

const mockFiles: File[] = [
  {
    id: 1,
    name: "Medical Report.pdf",
    type: "PDF",
    size: 2048,
    dateUploaded: "2025-05-16",
    uploadedBy: "Caregiver A",
    description: "Patient's latest medical report",
    relatedEntity: { type: "CarePlan", id: 1 },
    url: "#",
  },
  {
    id: 2,
    name: "Prescription.png",
    type: "Image",
    size: 512,
    dateUploaded: "2025-05-15",
    uploadedBy: "User",
    description: "Scanned prescription image",
    relatedEntity: { type: "Patient", id: 1 },
    url: "#",
  },
];

const FileManagementPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>(mockFiles);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFileMetadata, setNewFileMetadata] = useState({
    description: "",
    relatedEntityType: "" as "" | "CarePlan" | "Patient",
    relatedEntityId: "",
  });
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [filterType, setFilterType] = useState<"All" | "PDF" | "Image">("All");
  const [filterUploadedBy, setFilterUploadedBy] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"name" | "dateUploaded" | "size">(
    "dateUploaded"
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "admin"
  ); // Mock role
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch files from API
    // Example: fetchFiles().then(setFiles);
    setFiles(mockFiles); // Mock data for demo
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: globalThis.File) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, PNG, and JPG files are allowed");
      return;
    }
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setNewFile(file as any);
    setIsUploadModalOpen(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFileMetadata({ ...newFileMetadata, [name]: value });
  };

  const handleEditMetadataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editedFile) return;
    const { name, value } = e.target;
    setEditedFile({ ...editedFile, [name]: value });
  };

  const uploadFile = () => {
    if (!newFile) return;
    const newId = files.length + 1;
    const newFileEntry: File = {
      id: newId,
      name: newFile.name,
      type: newFile.type.includes("image") ? "Image" : "PDF",
      size: Math.round(newFile.size / 1024), // Convert to KB
      dateUploaded: format(new Date(), "yyyy-MM-dd"),
      uploadedBy: "Current User", // Replace with auth user
      description: newFileMetadata.description,
      relatedEntity:
        newFileMetadata.relatedEntityType && newFileMetadata.relatedEntityId
          ? {
              type: newFileMetadata.relatedEntityType as "CarePlan" | "Patient",
              id: parseInt(newFileMetadata.relatedEntityId),
            }
          : undefined,
      url: "#", // Replace with actual URL from API
    };
    setFiles([...files, newFileEntry]);
    toast.success("File uploaded successfully");
    setIsUploadModalOpen(false);
    setNewFile(null);
    setNewFileMetadata({
      description: "",
      relatedEntityType: "",
      relatedEntityId: "",
    });
  };

  const handleEditFile = () => {
    if (!editedFile) return;
    setFiles(
      files.map((file) => (file.id === editedFile.id ? editedFile : file))
    );
    toast.success("File metadata updated successfully");
    setIsEditModalOpen(false);
    setEditedFile(null);
  };

  const handleDeleteFile = (id: number) => {
    setFileToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!fileToDelete) return;
    setFiles(files.filter((file) => file.id !== fileToDelete));
    toast.success("File deleted successfully");
    setIsDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const handleBulkDelete = () => {
    setFiles([]);
    toast.success("All files deleted successfully");
  };

  const handleDownloadFile = (url: string) => {
    // Simulate download (replace with actual download logic)
    window.open(url, "_blank");
    toast.success("File download started");
  };

  const handlePreviewFile = (file: File) => {
    setPreviewFile(file);
    setIsPreviewModalOpen(true);
  };

  const filteredFiles = files
    .filter((file) => {
      if (filterType === "All") return true;
      return file.type === filterType;
    })
    .filter((file) => {
      if (filterUploadedBy === "All") return true;
      return file.uploadedBy === filterUploadedBy;
    })
    .filter((file) => {
      if (userRole === "caregiver")
        return (
          file.uploadedBy.includes("Caregiver") ||
          file.relatedEntity?.type === "Patient"
        );
      if (userRole === "user") return file.uploadedBy === "User";
      if (userRole === "family_member") return file.type === "PDF"; // Only critical files
      return true; // Admin sees all
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") return a.size - b.size;
      return (
        new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime()
      );
    });

  const renderFiles = () => {
    if (filteredFiles.length === 0) {
      return <p className="text-gray-500 text-center">No files found.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Date Uploaded</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} MB</TableCell>
                  <TableCell>{file.dateUploaded}</TableCell>
                  <TableCell>{file.uploadedBy}</TableCell>
                  <TableCell>{file.description || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                      onClick={() => handleDownloadFile(file.url)}
                      aria-label={`Download ${file.name}`}
                    >
                      <FaDownload />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 border-blue-400 text-blue-500 hover:bg-blue-50"
                      onClick={() => handlePreviewFile(file)}
                      aria-label={`Preview ${file.name}`}
                    >
                      <FaEye />
                    </Button>
                    {userRole !== "family_member" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-green-400 text-green-500 hover:bg-green-50"
                          onClick={() => {
                            setEditedFile(file);
                            setIsEditModalOpen(true);
                          }}
                          aria-label={`Edit ${file.name}`}
                        >
                          <FaFileAlt />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 border-red-400 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteFile(file.id)}
                          aria-label={`Delete ${file.name}`}
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
                <FaFileAlt className="text-green-500" /> File Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and organize your files
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userRole === "admin" && (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleBulkDelete}
                aria-label="Delete all files"
              >
                Delete All Files
              </Button>
            )}
            {userRole !== "family_member" && (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload new file"
              >
                <FaUpload className="mr-2" /> Upload File
              </Button>
            )}
          </div>
        </motion.header>

        {/* File Upload Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Upload New File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                aria-label="Select file to upload"
              />
              <p className="text-gray-500">
                Drag and drop your file here or{" "}
                <span
                  className="text-green-500 cursor-pointer hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supported formats: PDF, PNG, JPG (max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
              <FaCalendarAlt /> File Upload Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              events={files.map((file) => ({
                title: file.name,
                start: new Date(file.dateUploaded),
                end: new Date(file.dateUploaded),
              }))}
              className="w-full"
              aria-label="File upload timeline calendar"
            />
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Files
              </CardTitle>
              <div className="flex gap-4">
                <Select
                  value={filterType}
                  onValueChange={(value) => setFilterType(value as any)}
                  aria-label="Filter files by type"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Image">Image</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterUploadedBy}
                  onValueChange={setFilterUploadedBy}
                  aria-label="Filter files by uploader"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Uploaded By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Caregiver A">Caregiver A</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                  aria-label="Sort files"
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="dateUploaded">Date Uploaded</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderFiles()}</CardContent>
        </Card>
      </main>

      {/* Upload Metadata Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={newFile?.name} readOnly aria-label="File name" />
            <Textarea
              placeholder="Description (optional)"
              name="description"
              value={newFileMetadata.description}
              onChange={handleMetadataChange}
              aria-label="File description"
            />
            <Select
              value={newFileMetadata.relatedEntityType}
              onValueChange={(value) =>
                setNewFileMetadata({
                  ...newFileMetadata,
                  relatedEntityType: value as "" | "CarePlan" | "Patient",
                })
              }
              aria-label="Related entity type"
            >
              <SelectTrigger>
                <SelectValue placeholder="Related To (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="CarePlan">Care Plan</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            {newFileMetadata.relatedEntityType && (
              <Input
                placeholder="Related Entity ID"
                name="relatedEntityId"
                value={newFileMetadata.relatedEntityId}
                onChange={handleMetadataChange}
                aria-label="Related entity ID"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false);
                setNewFile(null);
                setNewFileMetadata({
                  description: "",
                  relatedEntityType: "",
                  relatedEntityId: "",
                });
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFile}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Upload file"
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit File Metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={editedFile?.name} readOnly aria-label="File name" />
            <Textarea
              placeholder="Description (optional)"
              name="description"
              value={editedFile?.description || ""}
              onChange={handleEditMetadataChange}
              aria-label="File description"
            />
            <Select
              value={editedFile?.relatedEntity?.type || ""}
              onValueChange={(value) =>
                setEditedFile({
                  ...editedFile!,
                  relatedEntity: value
                    ? {
                        type: value as "CarePlan" | "Patient",
                        id: editedFile?.relatedEntity?.id || 0,
                      }
                    : undefined,
                })
              }
              aria-label="Related entity type"
            >
              <SelectTrigger>
                <SelectValue placeholder="Related To (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="CarePlan">Care Plan</SelectItem>
                <SelectItem value="Patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            {editedFile?.relatedEntity && (
              <Input
                placeholder="Related Entity ID"
                name="relatedEntityId"
                value={editedFile?.relatedEntity?.id || ""}
                onChange={(e) =>
                  setEditedFile({
                    ...editedFile!,
                    relatedEntity: {
                      ...editedFile!.relatedEntity!,
                      id: parseInt(e.target.value) || 0,
                    },
                  })
                }
                aria-label="Related entity ID"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditedFile(null);
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditFile}
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Save changes"
            >
              Save Changes
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
          <p>Are you sure you want to delete this file?</p>
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

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview: {previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {previewFile?.type === "Image" ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-w-full max-h-[500px]"
              />
            ) : (
              <iframe
                src={previewFile?.url}
                title={previewFile?.name}
                className="w-full h-[500px]"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewModalOpen(false)}
              aria-label="Close preview"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileManagementPage;
