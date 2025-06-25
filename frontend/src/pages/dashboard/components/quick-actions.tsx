import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTasks, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

interface QuickActionsProps {
    setTaskModalOpen: (open: boolean) => void;
    setAlertModalOpen: (open: boolean) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setTaskModalOpen, setAlertModalOpen }) => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 mb-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button
                        onClick={() => setTaskModalOpen(true)}
                        className="flex-col h-24 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-xl font-semibold"
                    >
                        <FaTasks className="text-xl mb-2" />
                        <span>Add Task</span>
                    </Button>

                    <Button
                        className="flex-col h-24 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-xl font-semibold"
                    >
                        <FaCalendarAlt className="text-xl mb-2" />
                        <span>Add Appointment</span>
                    </Button>

                    <Button
                        className="flex-col h-24 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-600 rounded-xl font-semibold"
                    >
                        <GiMedicines className="text-xl mb-2" />
                        <span>Add Medication</span>
                    </Button>

                    <Button
                        onClick={() => setAlertModalOpen(true)}
                        className="flex-col h-24 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-semibold"
                    >
                        <FaExclamationTriangle className="text-xl mb-2" />
                        <span>Create Alert</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};