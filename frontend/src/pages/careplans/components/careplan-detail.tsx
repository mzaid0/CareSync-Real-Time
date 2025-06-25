import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CarePlan } from "@/types/careplan";
import type { User } from "@/types/user";

interface DetailModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedPlan: CarePlan | null;
    users: User[] | undefined;
    updateTaskStatus: (payload: { carePlanId: string; taskId: string; status: string }) => void;
}

const DetailModal = ({
    isOpen,
    setIsOpen,
    selectedPlan,
    users,
    updateTaskStatus,
}: DetailModalProps) => {
    const getUserName = (userId: string) => users?.find(u => u._id === userId)?.name || "Unknown";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedPlan?.title}</DialogTitle>
                </DialogHeader>
                {selectedPlan && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-gray-500">By</p>
                                <p>{getUserName(selectedPlan.userId)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Created</p>
                                <p>{new Date(selectedPlan.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Tasks</h4>
                            {selectedPlan.tasks.map(task => (
                                <div key={task._id} className="border p-3 rounded mb-2">
                                    <div className="flex justify-between">
                                        <p className="font-medium">{task.taskName}</p>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${task.status === "Completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : task.status === "In Progress"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Assigned: {getUserName(task.assignedTo)}</p>
                                    <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                                    <Select
                                        value={task.status}
                                        onValueChange={value =>
                                            updateTaskStatus({
                                                carePlanId: selectedPlan._id,
                                                taskId: task._id!,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="bg-green-400 hover:bg-green-500 text-white"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DetailModal;