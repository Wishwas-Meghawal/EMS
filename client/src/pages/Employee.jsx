// Employees.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Users,
  Briefcase,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModel, setShowCreateModel] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(
      dummyEmployeeData.filter((emp) =>
        selectedDept ? emp.department === selectedDept : emp,
      ),
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Replace with actual API call
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Static dummy data for design only
  const employeess = [
    {
      name: "David Michael",
      designation: "Associate Business Support",
      department: "IT Support",
    },
    {
      name: "Alex Matthew",
      designation: "Software Developer",
      department: "Engineering",
    },
    {
      name: "John Doe",
      designation: "Senior Software Developer",
      department: "Engineering",
    },
    {
      name: "Sarah Johnson",
      designation: "Marketing Manager",
      department: "Marketing",
    },
    {
      name: "Emily Brown",
      designation: "UI/UX Designer",
      department: "Designing",
    },
    {
      name: "Michael Lee",
      designation: "Support Specialist",
      department: "Support - Online",
    },
  ];

  const departments = [
    "All Departments",
    "IT Support",
    "Engineering",
    "Marketing",
    "Designing",
    "Support - Offline",
    "Support - Online",
  ];

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage your team members and their roles
            </p>
          </div>

          <button
            onClick={() => setShowCreateModel(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Employee
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees by name or role..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          {/* Department Filter Dropdown */}
          <div className="relative md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {employees.length} employees
          </p>
        </div>

        {/* Employee Cards Grid */}

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8  border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <P className="col-span-full text-center py-16  text-slate-400 bg-white rounded-2xl boder border-dashed border-slate-200">
                No employee found{" "}
              </P>
            ) : (
              filtered.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  onDelete={fetchEmployees}
                  onEdit={(e) => setEditEmployee(e)}
                />
              ))
            )}
          </div>
        )}

        {/* Create Employee Model */}
        {showCreateModel && (
          <div
            className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-auto"
            onClick={() => setShowCreateModel(false)}
          >
            <div className="fixed inset-0" />
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-shadow-slate-900">
                    Add New Employee
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Create a user account and employee profile
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModel(false)}
                  className="p-2 rounded-lg hover:bg-slate-100
                  transition-colors text-slate-400 hover: text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  onSuccess={() => {
                    setShowCreateModel(false);
                    fetchEmployees();
                  }}
                  onCancle={() => setShowCreateModel(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Model */}

        {editEmployee && (
          <div
            className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-auto"
            onClick={() => setEditEmployee(null)}
          >
            <div className="fixed inset-0" />
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-semibold text-shadow-slate-900">
                    Edit Employee
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Update employee details
                  </p>
                </div>
                <button
                  onClick={() => setEditEmployee(null)}
                  className="p-2 rounded-lg hover:bg-slate-100
                  transition-colors text-slate-400 hover: text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  initialData={editEmployee}
                  onSuccess={() => {
                    setEditEmployee(null);
                    fetchEmployees();
                  }}
                  onCancle={() => setEditEmployee(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
