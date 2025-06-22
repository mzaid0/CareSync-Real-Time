import { Button } from "@/components/ui/button";
import { mockStats } from "@/constants/dashboard-data";
import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ActivityTracker } from "@/components/dashboard/activity-tracker";
import { AlertModal } from "@/components/dashboard/alert-model";
import { AppointmentsCard } from "@/components/dashboard/appointment-card";
import { CarePlanCard } from "@/components/dashboard/careplan-card";
import { ChatPanel } from "@/components/dashboard/chat-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { HealthStatusCard } from "@/components/dashboard/health-status-card";
import { MedicationsCard } from "@/components/dashboard/medicatin-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsCards } from "@/components/dashboard/status-cards";
import { TaskModal } from "@/components/dashboard/task-model";
import { VitalSignsCard } from "@/components/dashboard/vitalsigns-card";

const Dashboard: React.FC = () => {
    const [emergencyStatus, setEmergencyStatus] = useState<boolean>(false);
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
    const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
    const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <DashboardHeader
                    notificationsOpen={notificationsOpen}
                    setNotificationsOpen={setNotificationsOpen}
                    chatOpen={chatOpen}
                    setChatOpen={setChatOpen}
                    emergencyStatus={emergencyStatus}
                    setEmergencyStatus={setEmergencyStatus}
                />

                {emergencyStatus && (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 animate-pulse shadow-md">
                        <div className="flex items-center gap-3 text-white">
                            <FaExclamationTriangle className="text-xl" />
                            <p className="font-semibold text-lg">EMERGENCY ALERT ACTIVE - ASSISTANCE REQUIRED</p>
                        </div>
                        <Button
                            variant="secondary"
                            className="bg-white text-red-600 hover:bg-gray-100 rounded-xl font-semibold"
                            onClick={() => setEmergencyStatus(false)}
                        >
                            Resolve Alert
                        </Button>
                    </div>
                )}

                <QuickActions setTaskModalOpen={setTaskModalOpen} setAlertModalOpen={setAlertModalOpen} />

                <StatsCards stats={mockStats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <CarePlanCard />
                            <MedicationsCard />
                            <AppointmentsCard />
                            <VitalSignsCard />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <HealthStatusCard />
                        <ActivityTracker />
                    </div>
                </div>
            </div>

            <ChatPanel chatOpen={chatOpen} setChatOpen={setChatOpen} />
            <TaskModal taskModalOpen={taskModalOpen} setTaskModalOpen={setTaskModalOpen} />
            <AlertModal alertModalOpen={alertModalOpen} setAlertModalOpen={setAlertModalOpen} />
        </div>
    );
};

export default Dashboard;