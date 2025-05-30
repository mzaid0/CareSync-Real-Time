import { format, isSameDay } from "date-fns";
import { useState } from "react";

// Define the Event type for calendar events
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

// Props for the CustomCalendar component
interface CustomCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  events?: CalendarEvent[];
  className?: string;
}

const CustomCalendar = ({
  value,
  onChange,
  events = [],
  className = "",
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  // Get days in current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Add padding days from previous month
    for (let i = firstDay.getDay(); i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add padding days for next month
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Check if date has events
  const hasEvents = (date: Date) => {
    return events.some((event) => isSameDay(event.start, date));
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-2 py-1 rounded hover:bg-gray-100"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = value && isSameDay(day, value);
          const dayHasEvents = hasEvents(day);

          return (
            <button
              key={index}
              onClick={() => onChange(day)}
              className={`
                p-2 rounded-full text-sm
                ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${isSelected ? "bg-green-500 text-white" : "hover:bg-gray-100"}
                ${dayHasEvents ? "relative" : ""}
              `}
              aria-label={`Select ${format(day, "MMMM d, yyyy")}`}
            >
              {day.getDate()}
              {dayHasEvents && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
