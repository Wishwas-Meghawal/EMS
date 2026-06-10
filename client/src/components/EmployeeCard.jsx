import { Briefcase, Edit, Mail, Phone, Trash2 } from "lucide-react";
import React from "react";

const EmployeeCard = ({ employee, onDelete, onEdit }) => {

  const handelDelete = async ()=>{
    if(!confirm("Are you sure you want to delete this employee ?"))
    return;
  }
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
      {/* Card Content */}
      <div className="p-6 flex flex-col items-center text-center h-[290px]">
        {/* Department Badge - Top */}
        <div className="w-full flex justify-start mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium">
            {employee.department || "Remote "}
          </span>
          {employee.isDeleted && (
            <span className="bg-red-500/60 font-medium text-white px-2.5 py-1 text-xs rounded">
              DELETED
            </span>
          )}
        </div>

        {!employee.isDeleted && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {" "}
            <button
            onClick={()=>onEdit(employee)}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 shadow-sm transition cursor-pointer"
              title="Edit Employee"
            >
              {" "}
              <Edit className="w-4 h-4 text-blue-600" />{" "}
            </button>
            <button
            onClick={handelDelete}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 shadow-sm transition cursor-pointer"
              title="Delete Employee "
            >
              <Trash2  className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        {/* Avatar - Center */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {employee.firstName[0]} {employee.lastName[0]}
            </span>
          </div>

          {/* Employee Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">
            {employee.firstName} {employee.lastName}
          </h3>

          {/* Role/Designation */}
          <p className="text-sm text-gray-500 mb-3">{employee.position}</p>

          {/* Quick Action Buttons (on hover) */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="p-1.5 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <Mail className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
            </button>
            <button className="p-1.5 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <Phone className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
            </button>
            <button className="p-1.5 bg-gray-100 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <Briefcase className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
