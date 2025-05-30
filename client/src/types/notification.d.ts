 interface Notification {
  _id: string;
  userId: string;
  message: string;
  type:
    | "task_reminder"
    | "careplan_added"
    | "careplan_updated"
    | "task_assigned";
  carePlanId?: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
  relatedEntity?: {
    type: "CarePlan" | "Task";
    id: string;
  };
}
