import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { carePlans, medications, appointments, healthStatus } from "@/constants/dashboard-data";
import { FaCalendarAlt, FaPills, FaTasks } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

export const UserContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                    <FaTasks /> My Care Plans
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {carePlans.map((plan) => (
                    <div key={plan.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-800">{plan.task}</span>
                            <Badge className={plan.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                {plan.status}
                            </Badge>
                        </div>
                        <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: `${plan.progress}%` }} />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Due: {plan.dueDate}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                    <FaPills /> My Medications
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {medications.map((med) => (
                    <div key={med.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-800">{med.name} - {med.time}</span>
                            <Badge className={med.status === "Taken" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {med.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Date: {med.date}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                    <FaCalendarAlt /> My Appointments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {appointments.map((appt) => (
                    <div key={appt.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-gray-800">{appt.doctor}</p>
                        <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                    <BsGraphUp /> My Health Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={healthStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="heartRate" fill="#4ADE80" name="Heart Rate" />
                        <Bar dataKey="bloodPressure" fill="#86EFAC" name="Blood Pressure" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
);