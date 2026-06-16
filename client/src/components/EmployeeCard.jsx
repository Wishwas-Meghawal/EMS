import { Briefcase, Edit, Mail, Phone, Trash2 } from "lucide-react";
import React from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const EmployeeCard = ({ employee, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employee/${employee.id || employee._id}`);
      onDelete();
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  // Initials fallback
  const initials = employee.employeeName
    ? employee.employeeName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Department color accent
  const deptColors = {
    Engineering: "bg-blue-50 text-blue-700 border border-blue-100",
    Design: "bg-purple-50 text-purple-700 border border-purple-100",
    Marketing: "bg-orange-50 text-orange-700 border border-orange-100",
    HR: "bg-green-50 text-green-700 border border-green-100",
    Finance: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    Sales: "bg-pink-50 text-pink-700 border border-pink-100",
  };
  const deptClass =
    deptColors[employee.department] ||
    "bg-slate-50 text-slate-600 border border-slate-100";

  return (
    <div className="relative group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">

      {/* Top accent bar — unique visual signature */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-400" />

      {/* Edit / Delete — appear on hover */}
      {!employee.isDeleted && (
        <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 shadow-sm transition"
            title="Edit employee"
          >
            <Edit className="w-3.5 h-3.5 text-blue-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 shadow-sm transition"
            title="Delete employee"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      )}

      <div className="p-6 flex flex-col items-center text-center gap-3">

        {/* Dept badge + deleted pill */}
        <div className="w-full flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${deptClass}`}>
            {employee.department || "No Dept"}
          </span>
          {employee.isDeleted && (
            <span className="bg-red-100 text-red-600 border border-red-200 font-medium px-2.5 py-0.5 text-xs rounded-full">
              Deactivated
            </span>
          )}
          <span
            className={`ml-auto w-2 h-2 rounded-full ${
              employee.employeeStatus === "ACTIVE" && !employee.isDeleted
                ? "bg-emerald-400"
                : "bg-slate-300"
            }`}
            title={employee.employeeStatus}
          />
        </div>

        {/* ✅ Profile Photo or Initials Avatar */}
        <div className="relative">
          {employee.profilePhoto ? (
            <img
              src={`${API_URL}/${employee.profilePhoto}`}
              alt={employee.employeeName}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-md group-hover:shadow-lg transition-all duration-300"
              onError={(e) => {
                // fallback to initials div if image fails
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          {/* Initials fallback — always rendered, hidden when photo exists */}
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
            style={{ display: employee.profilePhoto ? "none" : "flex" }}
          >
            <span className="text-white text-xl font-bold tracking-wide">
              {initials}
            </span>
          </div>
        </div>

        {/* Name + Position */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 leading-tight">
            {employee.employeeName}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            {employee.position || "—"}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-100" />

        {/* Contact row */}
        <div className="w-full flex flex-col gap-1.5 text-left">
          {employee.email && (
            <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
          {employee.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          {employee.employeeCode && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="font-mono">{employee.employeeCode}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;