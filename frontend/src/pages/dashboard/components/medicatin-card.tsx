import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FaPills, FaPlus } from "react-icons/fa";
import { medications, type Medication } from "@/constants/dashboard-data";

export const MedicationsCard: React.FC = () => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <FaPills className="text-blue-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">My Medications</h2>
                            <p className="text-xs text-gray-500 font-normal">{medications.length} scheduled today</p>
                        </div>
                    </CardTitle>
                    <Button variant="ghost" className="text-green-500 hover:bg-green-50">
                        <FaPlus size={14} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {medications.map((med: Medication) => (
                    <div
                        key={med.id}
                        className="p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-900 font-medium">{med.name}</span>
                                <span className="text-gray-500 ml-2">- {med.time}</span>
                            </div>
                            <Badge
                                className={med.status === "Taken" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                                {med.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">Date: {med.date}</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-gray-300 hover:bg-gray-50 rounded-xl"
                                >
                                    Log
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs border-gray-300 hover:bg-gray-50 rounded-xl"
                                >
                                    Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-300 hover:bg-green-50 rounded-xl font-semibold"
                >
                    Medication History
                </Button>
            </CardFooter>
        </Card>
    );
};