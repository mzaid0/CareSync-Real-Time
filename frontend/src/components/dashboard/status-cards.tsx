import React from "react";
import type { MockStats } from "@/constants/dashboard-data";
import { FaTasks, FaCalendarAlt, FaPills, FaExclamationTriangle } from "react-icons/fa";

interface StatsCardsProps {
    stats: MockStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    const statItems = [
        { title: "Care Plans", value: stats.care_plans, subtitle: "Active plans", icon: FaTasks, gradient: "from-green-500 to-green-400" },
        { title: "Appointments", value: stats.appointments, subtitle: "Scheduled", icon: FaCalendarAlt, gradient: "from-blue-500 to-blue-400" },
        { title: "Medications", value: stats.medications, subtitle: "Today", icon: FaPills, gradient: "from-purple-500 to-purple-400" },
        { title: "Alerts", value: stats.alerts, subtitle: "Active", icon: FaExclamationTriangle, gradient: "from-red-500 to-red-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg p-6 text-white transform hover:-translate-y-1 transition-transform duration-300 min-h-[140px]`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-3xl font-bold mt-2">{item.value}</p>
                                <p className="text-sm opacity-80 mt-1">{item.subtitle}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Icon className="text-xl" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};