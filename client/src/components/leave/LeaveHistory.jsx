import React, { useState } from "react";
import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);
  };

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="table-modern">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th className="text-center">Actions</th>}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => {
                return (
                  <tr
                    key={leave._id || leave.id}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group"
                    style={{ height: "70px" }}
                  >
                    {/* Date Column */}
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">
                            {leave.employee?.firstName}
                            {leave.employee?.lastName}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Check In Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-600 font-medium">
                          {leave.type }
                        </span>
                      </div>
                    </td>

                    {/* Check Out Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-600 font-medium">
                          {format(new Date(leave.startDate), "MMM dd ")} - {format(new Date(leave.endDate), "MMM dd yyyy")}
                        </span>
                      </div>
                    </td>

                    {/* Working Hours Column */}
                    <td className="px-6 py-4" title={leave.reason}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-semibold">
                          {leave.reason}
                        </span>
                      </div>
                    </td>

                    {/* Day Type Column */}
                    <td className="px-6 py-4">
                      <span className= {`badge ${leave.statua === "APPROVED" ? "badge-success" : leave.status=== "REJECTED" ? "badge-danger": "badge-warning"}`}>
                        {leave.status}
                      </span>
                    </td>

                    {isAdmin && (
                       <td>
                        {leave.status === "PENDING" && (
                          <div className="flex justify-center gap-2">
                            <button 
                            onClick={()=>handleStatusUpdate(leave._id || leave.id, "APPROVED")}
                            disabled={!!processing}
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-600
                            hover:bg-emerald-100 transition-colors">
                              {processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin"/>: <Check className="w-4 h-4"/>}
                            </button>

                            <button
                            onClick={()=>handleStatusUpdate(leave._id || leave.id, "REJECTED")}
                            disabled={!!processing}
                            className="p-1.5 rounded-md bg-rose-50 text-rose-600
                            hover:bg-rose-100 transition-colors">
                              {processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin"/>: <X className="w-4 h-4"/>}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                   
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 4}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <CalendarDays
                        size={40}
                        className="text-slate-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-slate-900 font-semibold text-lg mb-1">
                      No leave applications found
                    </h3>
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

export default LeaveHistory;
