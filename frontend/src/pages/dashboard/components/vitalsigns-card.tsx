import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeartbeat } from "react-icons/fa";
import { BsSpeedometer2 } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { vitalSigns, type VitalSign } from "@/constants/dashboard-data";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaHeartbeat,
    BsSpeedometer2,
};

export const VitalSignsCard: React.FC = () => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                        <div className="bg-red-100 p-3 rounded-xl">
                            <FaHeartbeat className="text-red-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Vital Signs</h2>
                            <p className="text-xs text-gray-500 font-normal">Current readings</p>
                        </div>
                    </CardTitle>
                    <Button variant="ghost" className="text-green-500 hover:bg-green-50">
                        <IoMdSettings size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {vitalSigns.map((vital: VitalSign, index: number) => {
                        const Icon = iconMap[vital.icon];
                        return (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-all hover:shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="bg-gray-100 p-2 rounded-lg">
                                        <Icon className="text-xl" />
                                    </div>
                                    <Badge
                                        variant={vital.trend === "good" ? "default" : "secondary"}
                                        className="text-xs capitalize"
                                    >
                                        {vital.trend}
                                    </Badge>
                                </div>
                                <h3 className="text-sm text-gray-500 mt-2">{vital.name}</h3>
                                <p className="text-xl font-semibold text-gray-900 mt-1">
                                    {vital.value}
                                    <span className="text-sm font-normal text-gray-500">{vital.unit}</span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};