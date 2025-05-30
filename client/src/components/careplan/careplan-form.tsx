import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import apiServices from "../../api/apiServices";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAppSelector } from "../../store/hooks";
import {
  carePlanSchema,
  type CarePlanFormValues,
} from "../../validator/careplan-zod";
import type { User } from "../../types/user";

interface CarePlanFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan?: CarePlan | null;
  setSelectedPlan?: React.Dispatch<React.SetStateAction<CarePlan | null>>;
}

const CarePlanForm = ({
  isOpen,
  onOpenChange,
  selectedPlan,
  setSelectedPlan,
}: CarePlanFormProps) => {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id || "";

  // Form setup
  const form = useForm<CarePlanFormValues>({
    resolver: zodResolver(carePlanSchema),
    defaultValues: selectedPlan
      ? {
          userId:
            typeof selectedPlan.userId === "string"
              ? selectedPlan.userId
              : selectedPlan.userId._id,
          title: selectedPlan.title,
          tasks: selectedPlan.tasks.map((task) => ({
            taskName: task.taskName,
            assignedTo:
              typeof task.assignedTo === "string"
                ? task.assignedTo
                : task.assignedTo._id,
            dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
            status: task.status,
            _id: task._id,
          })),
        }
      : {
          userId: userId,
          title: "",
          tasks: [{ taskName: "", assignedTo: "", dueDate: "", status: "Pending" }],
        },
  });

  // Fetch users for dropdown
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: apiServices.getUsers,
  });
  const users = usersData?.data.users || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: apiServices.createCarePlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      toast.success("Success", {
        description: data.message || "Care plan created successfully!",
      });
      onOpenChange(false);
      form.reset({
        userId: userId,
        title: "",
        tasks: [
          { taskName: "", assignedTo: "", dueDate: "", status: "Pending" },
        ],
      });
      if (setSelectedPlan) setSelectedPlan(null);
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to create care plan",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CarePlanFormValues>;
    }) => apiServices.updateCarePlan(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carePlans"] });
      queryClient.invalidateQueries({ queryKey: ["carePlans", selectedPlan?._id] });
      toast.success("Success", {
        description: data.message || "Care plan updated successfully!",
      });
      onOpenChange(false);
      if (setSelectedPlan) setSelectedPlan(null);
      form.reset({
        userId: userId,
        title: "",
        tasks: [
          { taskName: "", assignedTo: "", dueDate: "", status: "Pending" },
        ],
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to update care plan",
      });
    },
  });

  const handleAddTask = () => {
    const currentTasks = form.getValues("tasks");
    form.setValue("tasks", [
      ...currentTasks,
      { taskName: "", assignedTo: "", dueDate: "", status: "Pending" },
    ]);
  };

  const handleRemoveTask = (index: number) => {
    const currentTasks = form.getValues("tasks");
    form.setValue(
      "tasks",
      currentTasks.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: CarePlanFormValues) => {
    if (selectedPlan && setSelectedPlan) {
      updateMutation.mutate({ id: selectedPlan._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedPlan ? "Edit Care Plan" : "Add New Care Plan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Plan Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Care Plan Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!selectedPlan} // Disable for edit mode
                    >
                      <SelectTrigger aria-label="Select user">
                        <SelectValue placeholder="Select User" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: User) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Tasks</h4>
              {form.watch("tasks").map((_, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.taskName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Task Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.assignedTo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              aria-label={`Task ${index + 1} assigned to`}
                            >
                              <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user: User) => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.dueDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="date"
                            min={format(new Date(), "yyyy-MM-dd")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTask(index)}
                    aria-label={`Remove task ${index + 1}`}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                aria-label="Add new task"
              >
                <FaPlus /> Add Task
              </Button>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset({
                    userId: userId,
                    title: "",
                    tasks: [
                      {
                        taskName: "",
                        assignedTo: "",
                        dueDate: "",
                        status: "Pending",
                      },
                    ],
                  });
                  if (setSelectedPlan) setSelectedPlan(null);
                }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                aria-label={selectedPlan ? "Save changes" : "Add care plan"}
              >
                {selectedPlan ? "Save Changes" : "Add Care Plan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarePlanForm;