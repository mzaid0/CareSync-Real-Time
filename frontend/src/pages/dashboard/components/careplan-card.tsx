import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FaTasks, FaPlus } from "react-icons/fa";
import { carePlans, type CarePlan } from "@/constants/dashboard-data";

export const CarePlanCard: React.FC = () => {
    return (
        <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <FaTasks className="text-green-500 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">My Care Plans</h2>
                            <p className="text-xs text-gray-500 font-normal">{carePlans.length} active plans</p>
                        </div>
                    </CardTitle>
                    <Button variant="ghost" className="text-green-500 hover:bg-green-50">
                        <FaPlus size={14} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {carePlans.map((plan: CarePlan) => (
                    <div
                        key={plan.id}
                        className="p-4 bg-green-50 rounded-xl border border-green-100 transition-all hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-medium">{plan.task}</span>
                            <Badge
                                className={
                                    plan.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : plan.status === "In Progress"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                }
                            >
                                {plan.status}
                            </Badge>
                        </div>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                style={{
                                    width: `${plan.progress}%`,
                                    background:
                                        plan.progress === 100
                                            ? "linear-gradient(90deg, #10B981, #34D399)"
                                            : plan.progress > 50
                                                ? "linear-gradient(90deg, #FBBF24, #FCD34D)"
                                                : "linear-gradient(90deg, #9CA3AF, #D1D5DB)",
                                }}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">Due: {plan.dueDate}</p>
                            <span className="text-xs font-semibold text-green-600">{plan.progress}%</span>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-300 hover:bg-green-50 rounded-xl font-semibold"
                >
                    View All Plans
                </Button>
            </CardFooter>
        </Card>
    );
};