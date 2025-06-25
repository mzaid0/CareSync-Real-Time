import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { appointments,type Appointment } from "@/constants/dashboard-data";

export const AppointmentsCard: React.FC = () => {
  return (
    <Card className="bg-white rounded-2xl shadow-md border border-green-100 transition-all hover:shadow-lg min-h-[400px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-900">
            <div className="bg-purple-100 p-3 rounded-xl">
              <FaCalendarAlt className="text-purple-500 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
              <p className="text-xs text-gray-500 font-normal">{appointments.length} scheduled</p>
            </div>
          </CardTitle>
          <Button variant="ghost" className="text-green-500 hover:bg-green-50">
            <FaPlus size={14} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appt: Appointment) => (
          <div
            key={appt.id}
            className="p-4 bg-purple-50 rounded-xl border border-purple-100 transition-all hover:shadow-sm"
          >
            <p className="text-gray-900 font-medium">{appt.doctor}</p>
            <div className="flex items-center mt-2 text-sm">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span className="text-gray-500">{appt.date} at {appt.time}</span>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {appt.specialty}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-300 text-green-600 hover:bg-green-50 rounded-xl"
                >
                  Join
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
          Schedule New Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};