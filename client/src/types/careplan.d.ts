interface Task {
  _id?: string;
  taskName: string;
  assignedTo: string | { _id: string; name: string; email: string };
  status: "Pending" | "Completed" | "In Progress";
  dueDate: string;
}

interface CarePlan {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface CarePlanListResponse {
  carePlans: CarePlan[];
}
