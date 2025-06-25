import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BsGraphUp } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { healthStatus } from "@/constants/dashboard-data";

export const HealthStatusCard: React.FC = () => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <BsGraphUp className="text-green-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Health Status</h2>
                            <p className="text-xs text-gray-500 font-normal">Last 7 days</p>
                        </div>
                    </CardTitle>
                    <Button variant="ghost" className="text-green-500 hover:bg-green-50">
                        <IoMdSettings size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={healthStatus}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="heartRate" fill="#34D399" name="Heart Rate" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="bloodPressure" fill="#10B981" name="Blood Pressure" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                        <p className="text-sm text-gray-500">Avg. Heart Rate</p>
                        <p className="text-xl font-semibold text-green-600">73 BPM</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                        <p className="text-sm text-gray-500">Avg. Blood Pressure</p>
                        <p className="text-xl font-semibold text-green-600">121/80</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};