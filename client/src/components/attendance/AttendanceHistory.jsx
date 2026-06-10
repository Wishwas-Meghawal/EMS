import React from "react";
import { CalendarDays, Clock, LogIn, LogOut, Briefcase } from "lucide-react";
import { getDayTypeDisplay, getWorkingHoursDisplay } from "../../assets/assets";

import {format} from 'date-fns';

const AttendanceHistory = ({ history }) => {
 


  // Get day type badge styles
  const getDayTypeBadgeStyles = (dayType) => {
    switch (dayType) {
      case "Full Day":
        return "bg-green-50 text-green-700 ring-1 ring-green-200/50";
      case "Half Day":
        return "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50";
      default:
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-200/50";
    }
  };

  const tableHeaders = [
    { label: "Date", icon: CalendarDays },
    { label: "Check In", icon: LogIn },
    { label: "Check Out", icon: LogOut },
    { label: "Working Hours", icon: Clock },
    { label: "Day Type", icon: Briefcase },
    { label: "Status", icon: null },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Recent Activity
          {history.length > 0 && (
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {history.length} records
            </span>
          )}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Track your daily attendance and work patterns
        </p>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="table-modern">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index} className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    {header.icon && (
                      <header.icon size={14} className="text-slate-400" />
                    )}
                    <span className="text-slate-500 font-semibold tracking-wide text-sm uppercase">
                      {header.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {history.length > 0 ? (
              history.map((record) => {
                const dataType = getDayTypeDisplay(record);
                return (
                  <tr
                    key={record._id || record.id}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group"
                    style={{ height: "70px" }}
                  >
                    {/* Date Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold">
                          {format(new Date(record.date),"MMM dd yyyy")}
                        </span>
                        <span className="text-slate-400 text-xs mt-0.5">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Check In Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-600 font-medium">
                          {record.checkIn ? format(new Date(record.checkIn),"hh:mm a"): "-"}
                        </span>
                      </div>
                    </td>

                    {/* Check Out Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-600 font-medium">
                         {record.checkOut ? format(new Date(record.checkOut),"hh:mm a"): "-"}
                        </span>
                      </div>
                    </td>

                    {/* Working Hours Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-slate-700 font-semibold">
                          {getWorkingHoursDisplay(record)}
                        </span>
                      </div>
                    </td>

                    {/* Day Type Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                      ${getDayTypeBadgeStyles(record.dayType)}
                      transition-all duration-200 group-hover:scale-105
                    `}
                      >
                        {record.dayType}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`badge ${record.status === "PRESENT" ? "badge-succcess": record.status=== "LATE" ? "badge-warning" : "badge-danger"}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current opacity-60" />
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <CalendarDays
                        size={40}
                        className="text-slate-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-slate-900 font-semibold text-lg mb-1">
                      No attendance records found
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Your attendance history will appear here once you start
                      checking in.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;
