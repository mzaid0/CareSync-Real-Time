import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewAlert {
    type: string;
    description: string;
}

interface AlertModalProps {
    alertModalOpen: boolean;
    setAlertModalOpen: (open: boolean) => void;
    newAlert: NewAlert;
    setNewAlert: (alert: NewAlert) => void;
    handleAddAlert: () => void;
}

export const AlertModal = ({ alertModalOpen, setAlertModalOpen, newAlert, setNewAlert, handleAddAlert }: AlertModalProps) => {
    return (
        <Dialog open={alertModalOpen} onOpenChange={setAlertModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Select
                        value={newAlert.type}
                        onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}
                        aria-label="Alert type"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Alert Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fall Detected">Fall Detected</SelectItem>
                            <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Description"
                        value={newAlert.description}
                        onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                        aria-label="Alert description"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setAlertModalOpen(false)} aria-label="Cancel">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddAlert}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        aria-label="Save alert"
                    >
                        Save Alert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};