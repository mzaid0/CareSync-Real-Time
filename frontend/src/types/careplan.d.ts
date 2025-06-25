export interface Task {
  _id?: string;
  taskName: string;
  assignedTo: string;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
}

export interface CarePlan {
  _id: string;
  userId: string;
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}


interface FormTask {
  taskName: string;
  assignedTo: string;
  dueDate: string;
}

interface FormData {
  title: string;
  tasks: FormTask[];
}