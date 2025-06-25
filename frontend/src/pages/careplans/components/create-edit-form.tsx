import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CarePlan } from "@/types/careplan";
import type { User } from "@/types/user";
import { FaPlus, FaTrash } from "react-icons/fa";

interface FormTask {
  taskName: string;
  assignedTo: string;
  dueDate: string;
}

interface FormData {
  title: string;
  tasks: FormTask[];
}

interface CreateEditModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  users: User[] | undefined;
  selectedPlan: CarePlan | null;
  createCarePlan: (data: Partial<CarePlan>) => void;
  updateCarePlan: (payload: { id: string; data: Partial<CarePlan> }) => void;
  resetForm: () => void;
}

const CreateEditModal = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  users,
  selectedPlan,
  createCarePlan,
  updateCarePlan,
  resetForm,
}: CreateEditModalProps) => {
const addTask = () => {
  setFormData((prev: FormData) => ({
    ...prev,
    tasks: [
      ...prev.tasks,
      { taskName: "", assignedTo: "", dueDate: "" },
    ],
  }));
};

  const removeTask = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const updateTask = (index: number, field: keyof FormTask, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => (i === index ? { ...task, [field]: value } : task)),
    }));
  };

  const handleSave = () => {
    const data = {
      title: formData.title,
      tasks: formData.tasks.map(task => ({
        taskName: task.taskName,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        status: "Pending" as const,
      })),
    };
    if (selectedPlan) {
      updateCarePlan({ id: selectedPlan._id, data });
    } else {
      createCarePlan(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedPlan ? "Edit Plan" : "New Plan"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Plan Title</label>
            <Input
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Tasks</h4>
            {formData.tasks.map((task, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={task.taskName}
                    onChange={e => updateTask(index, "taskName", e.target.value)}
                    placeholder="Task name"
                  />
                  <div className="flex gap-2">
                    <Select
                      value={task.assignedTo}
                      onValueChange={value => updateTask(index, "assignedTo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map(user => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={task.dueDate}
                      onChange={e => updateTask(index, "dueDate", e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="ghost" className="text-red-500" onClick={() => removeTask(index)}>
                  <FaTrash />
                </Button>
              </div>
            ))}
            <Button variant="ghost" className="text-green-400" onClick={addTask}>
              <FaPlus className="mr-1" /> Add Task
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button className="bg-green-400 hover:bg-green-500 text-white" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditModal;