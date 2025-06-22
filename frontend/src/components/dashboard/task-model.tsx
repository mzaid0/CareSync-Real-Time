import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaTasks } from "react-icons/fa";

interface TaskModalProps {
    taskModalOpen: boolean;
    setTaskModalOpen: (open: boolean) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ taskModalOpen, setTaskModalOpen }) => {
    const [newTask, setNewTask] = useState({ taskName: "", dueDate: "", assignee: "" });

    return (
        <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl border border-green-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <FaTasks className="text-green-500" />
                        </div>
                        <h2 className="text-lg font-semibold">Create New Task</h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                        <Input
                            placeholder="Enter task name"
                            value={newTask.taskName}
                            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                            className="py-2 px-3 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="py-2 px-3 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                        <Select
                            value={newTask.assignee}
                            onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                        >
                            <SelectTrigger className="py-2 px-3 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500">
                                <SelectValue placeholder="Select Assignee" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-green-200 shadow-lg">
                                <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                                <SelectItem value="John Doe">John Doe</SelectItem>
                                <SelectItem value="Bob Smith">Bob Smith</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setTaskModalOpen(false)}
                        className="border-green-300 text-gray-700 hover:bg-green-50 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600 rounded-xl">Create Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};