import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface NewTask {
    taskName: string;
    dueDate: string;
    assignee: string;
}

interface TaskModalProps {
    taskModalOpen: boolean;
    setTaskModalOpen: (open: boolean) => void;
    newTask: NewTask;
    setNewTask: (task: NewTask) => void;
    handleAddTask: () => void;
}

export const TaskModal = ({ taskModalOpen, setTaskModalOpen, newTask, setNewTask, handleAddTask }: TaskModalProps) => {
    return (
        <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Task Name"
                        value={newTask.taskName}
                        onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                        aria-label="Task name"
                    />
                    <Input
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        aria-label="Due date"
                    />
                    <Select
                        value={newTask.assignee}
                        onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                        aria-label="Select assignee"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setTaskModalOpen(false)} aria-label="Cancel">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddTask}
                    >
                        Save Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};