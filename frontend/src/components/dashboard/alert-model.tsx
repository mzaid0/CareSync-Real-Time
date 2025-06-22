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
import { FaExclamationTriangle } from "react-icons/fa";

interface AlertModalProps {
    alertModalOpen: boolean;
    setAlertModalOpen: (open: boolean) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ alertModalOpen, setAlertModalOpen }) => {
    const [newAlert, setNewAlert] = useState({ title: "", description: "" });

    return (
        <Dialog open={alertModalOpen} onOpenChange={setAlertModalOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl border border-red-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <FaExclamationTriangle className="text-red-500" />
                        </div>
                        <h2 className="text-lg font-semibold">Create New Alert</h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                        <Input
                            placeholder="Enter alert title"
                            value={newAlert.title}
                            onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                            className="py-2 px-3 rounded-xl border-red-200 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Input
                            placeholder="Enter alert description"
                            value={newAlert.description}
                            onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                            className="py-2 px-3 rounded-xl border-red-200 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setAlertModalOpen(false)}
                        className="border-red-300 text-gray-700 hover:bg-red-50 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 rounded-xl">Create Alert</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};