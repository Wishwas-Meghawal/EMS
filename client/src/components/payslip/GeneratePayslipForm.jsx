import { Loader2, Plus, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// ── Year Picker ───────────────────────────────────────────────────────────────
const YearPicker = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const [page, setPage] = useState(0);
  const yearsPerPage = 12;
  const startYear = currentYear - 5 + page * yearsPerPage;
  const years = Array.from({ length: yearsPerPage }, (_, i) => startYear + i);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-200">
        <button type="button" onClick={() => setPage((p) => p - 1)}
          className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-slate-600">
          {years[0]} – {years[years.length - 1]}
        </span>
        <button type="button" onClick={() => setPage((p) => p + 1)}
          className="p-1 rounded hover:bg-slate-200 transition-colors text-slate-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1 p-2 bg-white">
        {years.map((y) => (
          <button key={y} type="button" onClick={() => onChange(y)}
            className={`py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${value === y
                ? "bg-purple-600 text-white shadow-sm"
                : y === currentYear
                ? "border border-purple-300 text-purple-700 hover:bg-purple-50"
                : "text-slate-600 hover:bg-slate-100"}`}>
            {y}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Number Input with +/- ─────────────────────────────────────────────────────
const NumberInput = ({ label, name, value, onChange, min = 0, error }) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <div className={`flex items-center border rounded-xl overflow-hidden transition-all
      ${error
        ? "border-red-400 ring-1 ring-red-300"
        : "border-slate-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
      <button type="button" onClick={() => onChange(Math.max(min, Number(value) - 100))}
        className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700
                   transition-colors border-r border-slate-200 active:bg-slate-200">
        <ChevronDown className="w-4 h-4" />
      </button>
      <input type="number" name={name} value={value} onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-800 focus:outline-none bg-white w-0" />
      <button type="button" onClick={() => onChange(Number(value) + 100)}
        className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700
                   transition-colors border-l border-slate-200 active:bg-slate-200">
        <ChevronUp className="w-4 h-4" />
      </button>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Main Form ─────────────────────────────────────────────────────────────────
const GeneratePayslipForm = ({ employees, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [errors, setErrors] = useState({});

  // ── Employee select hote hi uski salary seedha employees array se lo ──
  useEffect(() => {
    if (!selectedEmpId) {
      setBasicSalary(0);
      setAllowances(0);
      setDeductions(0);
      return;
    }
    const emp = employees.find((e) => (e._id || e.id) === selectedEmpId);
    if (emp) {
      setBasicSalary(emp.basicSalary ?? 0);
      setAllowances(emp.allowances ?? 0);
      setDeductions(emp.deductions ?? 0);
    }
  }, [selectedEmpId, employees]);

  const resetForm = () => {
    setSelectedEmpId("");
    setMonth(currentMonth);
    setYear(currentYear);
    setBasicSalary(0);
    setAllowances(0);
    setDeductions(0);
    setErrors({});
  };

  const handleClose = () => { setIsOpen(false); resetForm(); };

  const validate = () => {
    const errs = {};
    if (!selectedEmpId) errs.employeeId = "Please select an employee";
    if (basicSalary < 0) errs.basicSalary = "Salary cannot be negative";
    if (allowances < 0) errs.allowances = "Allowances cannot be negative";
    if (deductions < 0) errs.deductions = "Deductions cannot be negative";
    if (deductions > basicSalary + allowances)
      errs.deductions = "Deductions cannot exceed gross salary";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/payslips", { employeeId: selectedEmpId, month, year, basicSalary, allowances, deductions });
      toast.success("Payslip generated successfully!");
      handleClose();
      onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const netSalary = basicSalary + allowances - deductions;
  const selectedEmp = employees.find((e) => (e._id || e.id) === selectedEmpId);

  if (!isOpen)
    return (
      <button onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm
          shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
        <Plus className="w-4 h-4" />
        Generate Payslip
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Generate Monthly Payslip</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to generate payslip</p>
          </div>
          <button onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Employee Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => { setSelectedEmpId(e.target.value); setErrors((prev) => ({ ...prev, employeeId: "" })); }}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all
                focus:outline-none focus:ring-1
                ${errors.employeeId
                  ? "border-red-400 ring-red-300 focus:ring-red-300"
                  : "border-slate-200 focus:border-purple-400 focus:ring-purple-300"}
                ${!selectedEmpId ? "text-slate-400" : "text-slate-800"}`}>
              <option value="" disabled>— Select an employee —</option>
              {employees.map((e) => (
                <option key={e._id || e.id} value={e._id || e.id}>
                  {e.employeeName} ({e.position})
                </option>
              ))}
            </select>
            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>}

            {/* Selected employee quick info */}
            {selectedEmp && (
              <div className="mt-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <p className="text-xs text-purple-700 font-medium">
                  {selectedEmp.department} · {selectedEmp.employeeCode}
                  <span className="ml-2 text-purple-500 font-normal">
                    Profile salary: ₹{(selectedEmp.basicSalary ?? 0).toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800
                  focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-300 transition-all">
                {MONTH_NAMES.map((name, i) => (
                  <option key={i + 1} value={i + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <YearPicker value={year} onChange={setYear} />
            </div>
          </div>

          {/* Basic Salary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Basic Salary <span className="text-red-500">*</span>
              </label>
              {selectedEmp && (
                <button type="button"
                  onClick={() => {
                    setBasicSalary(selectedEmp.basicSalary ?? 0);
                    setAllowances(selectedEmp.allowances ?? 0);
                    setDeductions(selectedEmp.deductions ?? 0);
                  }}
                  className="text-xs text-purple-600 hover:text-purple-800 underline transition-colors">
                  Reset to profile values
                </button>
              )}
            </div>
            <NumberInput name="basicSalary" value={basicSalary}
              onChange={(v) => { setBasicSalary(v); setErrors((prev) => ({ ...prev, basicSalary: "" })); }}
              error={errors.basicSalary} />
          </div>

          {/* Allowances & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            <NumberInput label="Allowances" name="allowances" value={allowances}
              onChange={(v) => { setAllowances(v); setErrors((prev) => ({ ...prev, allowances: "" })); }}
              error={errors.allowances} />
            <NumberInput label="Deductions" name="deductions" value={deductions}
              onChange={(v) => { setDeductions(v); setErrors((prev) => ({ ...prev, deductions: "" })); }}
              error={errors.deductions} />
          </div>

          {/* Net Salary Preview */}
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between
            ${netSalary >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
            <div>
              <p className="text-xs text-slate-500">Net Salary</p>
              <p className="text-xs text-slate-400 mt-0.5">
                ₹{basicSalary.toLocaleString()} + ₹{allowances.toLocaleString()} − ₹{deductions.toLocaleString()}
              </p>
            </div>
            <span className={`text-xl font-bold ${netSalary >= 0 ? "text-emerald-700" : "text-red-600"}`}>
              ₹{netSalary.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold
                text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                disabled:translate-y-0 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Generating…" : "Generate Payslip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslipForm;