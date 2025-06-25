import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FaWalking } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { activityData } from "@/constants/dashboard-data";

export const ActivityTracker: React.FC = () => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <FaWalking className="text-orange-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Activity Tracker</h2>
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
                        <LineChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
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
                            <Line
                                type="monotone"
                                dataKey="steps"
                                stroke="#34D399"
                                strokeWidth={2}
                                dot={{ stroke: "#34D399", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                name="Steps"
                            />
                            <Line
                                type="monotone"
                                dataKey="distance"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={{ stroke: "#3B82F6", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                                name="Distance (km)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                        <p className="text-sm text-gray-500">Avg. Steps</p>
                        <p className="text-xl font-semibold text-orange-600">6,321</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                        <p className="text-sm text-gray-500">Avg. Distance</p>
                        <p className="text-xl font-semibold text-orange-600">3.8 km</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};