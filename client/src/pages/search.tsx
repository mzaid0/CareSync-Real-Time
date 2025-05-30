import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTasks,
  FaPills,
  FaExclamationTriangle,
  FaBell,
  FaCog,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaChevronRight,
  FaTimes,
  FaDownload,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

// Mock Data (aligned with Data Models, PDF page 8)
interface SearchResult {
  id: number;
  type:
    | "care_plan"
    | "appointment"
    | "medication"
    | "file"
    | "notification"
    | "family_member";
  title: string;
  description: string;
  date: string;
  patient?: { id: number; name: string };
  status?: "active" | "pending" | "completed";
}

interface AuditLog {
  id: number;
  action: string;
  timestamp: string;
}

const mockResults: SearchResult[] = [
  {
    id: 1,
    type: "care_plan",
    title: "Weekly Care for John",
    description: "Daily check-ins and medication reminders",
    date: "2025-05-16",
    patient: { id: 1, name: "John Doe" },
    status: "active",
  },
  {
    id: 2,
    type: "appointment",
    title: "Doctor Visit - Dr. Smith",
    description: "Cardiology check-up",
    date: "2025-05-15",
    patient: { id: 1, name: "John Doe" },
    status: "pending",
  },
  {
    id: 3,
    type: "medication",
    title: "Paracetamol Daily Dose",
    description: "500mg twice daily",
    date: "2025-05-14",
    patient: { id: 1, name: "John Doe" },
    status: "active",
  },
  {
    id: 4,
    type: "file",
    title: "Medical Report 2025",
    description: "Latest blood test results",
    date: "2025-05-13",
    patient: { id: 2, name: "Jane Smith" },
  },
  {
    id: 5,
    type: "notification",
    title: "Missed Medication Alert",
    description: "John missed paracetamol dose",
    date: "2025-05-12",
    patient: { id: 1, name: "John Doe" },
  },
  {
    id: 6,
    type: "family_member",
    title: "Jane Doe",
    description: "Family member with view access",
    date: "2025-05-11",
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    action: "Searched for 'paracetamol'",
    timestamp: "2025-05-16 05:00",
  },
  { id: 2, action: "Searched for 'John'", timestamp: "2025-05-15 14:00" },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<
    | "all"
    | "care_plan"
    | "appointment"
    | "medication"
    | "file"
    | "notification"
    | "family_member"
  >("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [patientFilter, setPatientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "completed"
  >("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "type" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [userRole] = useState<"user" | "caregiver" | "family_member" | "admin">(
    "admin"
  ); // Mock role
  const resultsPerPage = 5;

  useEffect(() => {
    // Fetch search results from API
    // Example: fetchSearchResults(query, category, dateRange, patientFilter, statusFilter).then(setResults);
    let filteredResults = mockResults;

    // Role-based filtering
    if (userRole === "user") {
      filteredResults = filteredResults.filter(
        (r) => r.patient?.name === "John Doe" // Mock user-specific data
      );
    } else if (userRole === "family_member") {
      filteredResults = filteredResults.filter(
        (r) => r.type === "care_plan" || r.type === "appointment" // Limited access
      );
    } else if (userRole === "caregiver") {
      filteredResults = filteredResults.filter(
        (r) => r.patient?.id === 1 || r.patient?.id === 2 // Assigned patients
      );
    }

    // Apply filters
    if (category !== "all") {
      filteredResults = filteredResults.filter((r) => r.type === category);
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredResults = filteredResults.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery) ||
          r.patient?.name.toLowerCase().includes(lowerQuery)
      );
    }
    if (dateRange.from && dateRange.to) {
      filteredResults = filteredResults.filter(
        (r) =>
          new Date(r.date) >= dateRange.from! &&
          new Date(r.date) <= dateRange.to!
      );
    }
    if (patientFilter !== "all") {
      filteredResults = filteredResults.filter(
        (r) => r.patient?.name === patientFilter
      );
    }
    if (statusFilter !== "all") {
      filteredResults = filteredResults.filter(
        (r) => r.status === statusFilter
      );
    }

    // Sorting
    filteredResults.sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "date") {
        return (
          order * (new Date(a.date).getTime() - new Date(b.date).getTime())
        );
      } else if (sortBy === "type") {
        return order * a.type.localeCompare(b.type);
      } else {
        return order * a.title.localeCompare(b.title);
      }
    });

    setResults(filteredResults);

    // Mock suggestions
    if (query) {
      const suggestionSet = new Set(
        mockResults
          .filter(
            (r) =>
              r.title.toLowerCase().includes(query.toLowerCase()) ||
              r.description.toLowerCase().includes(query.toLowerCase())
          )
          .map((r) => r.title)
      );
      setSuggestions(Array.from(suggestionSet).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [
    query,
    category,
    dateRange,
    patientFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    // Log search to audit (admin-only)
    if (userRole === "admin") {
      // Example: logSearch(query);
      toast.info(`Search logged: ${query}`);
    }
    setCurrentPage(1); // Reset to first page
  };

  const saveQuery = () => {
    if (!query.trim() || savedQueries.includes(query)) return;
    setSavedQueries([...savedQueries, query]);
    toast.success("Query saved");
  };

  const exportResults = () => {
    const csv = [
      ["Type", "Title", "Description", "Date", "Patient", "Status"],
      ...results.map((r) => [
        r.type.replace("_", " "),
        r.title,
        r.description,
        r.date,
        r.patient?.name || "",
        r.status || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_results.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported as CSV");
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setDateRange({});
    setPatientFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    setSortBy("date");
    setSortOrder("desc");
    toast.info("Filters cleared");
  };

  const handleSort = (column: "date" | "type" | "title") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const highlightTerm = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
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
                <FaSearch className="text-green-500" /> Search
              </h1>
              <p className="text-gray-500 mt-1">
                Find care plans, appointments, and more
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={saveQuery}
              disabled={!query || savedQueries.includes(query)}
              aria-label="Save search query"
            >
              Save Query
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={exportResults}
              disabled={!results.length}
              aria-label="Export results"
            >
              <FaDownload className="mr-2" /> Export
            </Button>
          </div>
        </motion.header>

        {/* Search Form */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search query"
                  className="pr-10"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setQuery("")}
                    aria-label="Clear query"
                  >
                    <FaTimes />
                  </Button>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700"
                        onClick={() => setQuery(suggestion)}
                        role="option"
                        aria-selected={query === suggestion}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as any)}
                    aria-label="Category filter"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="care_plan">Care Plan</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="family_member">
                        Family Member
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-gray-300"
                        aria-label="Select date range"
                      >
                        {dateRange.from && dateRange.to
                          ? `${format(
                              dateRange.from,
                              "MMM d, yyyy"
                            )} - ${format(dateRange.to, "MMM d, yyyy")}`
                          : "Date Range"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Select
                    value={patientFilter}
                    onValueChange={setPatientFilter}
                    aria-label="Patient filter"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}
                    aria-label="Status filter"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <FaFilter className="mr-2" /> Search
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={clearFilters}
                  aria-label="Clear filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Queries */}
        {savedQueries.length > 0 && (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Saved Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {savedQueries.map((q, i) => (
                  <Badge
                    key={i}
                    className="bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                    onClick={() => setQuery(q)}
                    role="button"
                    aria-label={`Load saved query: ${q}`}
                  >
                    {q}
                    <FaTimes
                      className="ml-1 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedQueries(
                          savedQueries.filter((_, index) => index !== i)
                        );
                        toast.info("Query removed");
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Search Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-gray-500 text-center">No results found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => handleSort("type")}
                        aria-label="Sort by type"
                      >
                        Type{" "}
                        {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => handleSort("title")}
                        aria-label="Sort by title"
                      >
                        Title{" "}
                        {sortBy === "title" &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => handleSort("date")}
                        aria-label="Sort by date"
                      >
                        Date{" "}
                        {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedResults.map((result) => (
                        <motion.tr
                          key={result.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TableCell className="capitalize">
                            {result.type.replace("_", " ")}
                          </TableCell>
                          <TableCell
                            dangerouslySetInnerHTML={{
                              __html: highlightTerm(result.title),
                            }}
                          />
                          <TableCell
                            dangerouslySetInnerHTML={{
                              __html: highlightTerm(result.description),
                            }}
                          />
                          <TableCell>{result.patient?.name || "-"}</TableCell>
                          <TableCell>
                            {format(new Date(result.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {result.status ? (
                              <Badge
                                className={
                                  result.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : result.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {result.status}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-400 text-green-500 hover:bg-green-50"
                              onClick={() => {
                                if (result.type === "care_plan")
                                  navigate(`/care-plans/${result.id}`);
                                if (result.type === "appointment")
                                  navigate(`/appointments/${result.id}`);
                                if (result.type === "medication")
                                  navigate(`/medications/${result.id}`);
                                if (result.type === "file")
                                  navigate(`/files/${result.id}`);
                                if (result.type === "notification")
                                  navigate(`/notifications/${result.id}`);
                                if (result.type === "family_member")
                                  navigate(`/family-sharing`);
                              }}
                              aria-label={`View ${result.title}`}
                            >
                              View
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
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
    </div>
  );
};

export default SearchPage;
