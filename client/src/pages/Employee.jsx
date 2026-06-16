import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  X,
  FileDown,
  Printer,
  Loader2,
} from "lucide-react";
import { DEPARTMENTS } from "../assets/assets";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";
import toast from "react-hot-toast";
import { exportEmployeesPDF, printEmployees } from "../utils/exportEmployees";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModel, setShowCreateModel] = useState(false);

  // Export states
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const url = selectedDept ? `/employee?department=${selectedDept}` : "/employee";
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filtered = employees.filter((emp) =>
    `${emp.employeeName} ${emp.position}`.toLowerCase().includes(search.toLowerCase())
  );

  // ── Export PDF ────────────────────────────────────────────
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Always fetch fresh full list for export (ignores current dept filter)
      const res = await api.get("/employee");
      const allEmployees = res.data;

      if (!allEmployees?.length) {
        toast("No employees found to export.", { icon: "ℹ️" });
        return;
      }

      const result = await exportEmployeesPDF(allEmployees, API_URL);
      if (result === "empty") {
        toast("No employees found to export.", { icon: "ℹ️" });
      } else {
        toast.success("Employee report exported successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export employee report");
    } finally {
      setExporting(false);
    }
  };

  // ── Print ─────────────────────────────────────────────────
  const handlePrint = async () => {
    setPrinting(true);
    try {
      const res = await api.get("/employee");
      const allEmployees = res.data;

      if (!allEmployees?.length) {
        toast("No employees found to print.", { icon: "ℹ️" });
        return;
      }

      const result = printEmployees(allEmployees, API_URL);
      if (result === "empty") {
        toast("No employees found.", { icon: "ℹ️" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to open print view");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="p-6 md:p-8">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage your team members and their roles
            </p>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-200
                         bg-white text-purple-700 font-semibold text-sm shadow-sm
                         hover:bg-purple-50 hover:border-purple-400 hover:shadow-md
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Export all employees to PDF"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {exporting ? "Exporting…" : "Export PDF"}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              disabled={printing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200
                         bg-white text-slate-700 font-semibold text-sm shadow-sm
                         hover:bg-slate-50 hover:border-slate-400 hover:shadow-md
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Print employee directory"
            >
              {printing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              {printing ? "Preparing…" : "Print"}
            </button>

            {/* Add Employee */}
            <button
              onClick={() => setShowCreateModel(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg
                         bg-gradient-to-r from-purple-600 to-indigo-600
                         hover:from-purple-700 hover:to-indigo-700
                         text-white font-semibold text-sm shadow-md hover:shadow-lg
                         transition-all duration-300 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Employee
            </button>
          </div>
        </div>

        {/* ── Search & Filter ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees by name or role..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 text-gray-700 placeholder-gray-400"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          <div className="relative md:w-64">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg
                         px-4 py-2.5 pr-10 text-gray-700
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{employees.length}</span> employees
          </p>
        </div>

        {/* ── Employee Grid ───────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No employees found
              </p>
            ) : (
              filtered.map((emp) => (
                <EmployeeCard
                  key={emp._id}
                  employee={emp}
                  onDelete={fetchEmployees}
                  onEdit={(e) => setEditEmployee(e)}
                />
              ))
            )}
          </div>
        )}

        {/* ── Create Modal ────────────────────────────────── */}
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
                  <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Create a user account and employee profile</p>
                </div>
                <button
                  onClick={() => setShowCreateModel(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  onSuccess={() => { setShowCreateModel(false); fetchEmployees(); }}
                  onCancle={() => setShowCreateModel(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Modal ──────────────────────────────────── */}
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
                  <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Update employee details</p>
                </div>
                <button
                  onClick={() => setEditEmployee(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  initialData={editEmployee}
                  onSuccess={() => { setEditEmployee(null); fetchEmployees(); }}
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
