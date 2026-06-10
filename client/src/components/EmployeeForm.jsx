import { ChevronDown, Loader2Icon, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";

const EmployeeForm = ({ initialData, onSuccess, onCancle }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;
  const handelSubmit = async (e) => {
    e.prevetnDefault();
  };
  return (
    <form className="space-y-8" onSubmit={handelSubmit}>
      {/* Two-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* 1. Employee Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="employeeName"
            required
            defaultValue={initialData?.firstName}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* 2. Employee Code */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Employee Code
          </label>
          <input
            type="text"
            name="employeeCode"
            placeholder="EMP001"
            maxLength={10}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* 3. Email Address */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            defaultValue={initialData?.email}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
        {!isEditMode && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Temporary Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div> 
        )}
        {isEditMode && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Change Password 
            </label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div> 
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">
              System Role
          </label>
          <select name="role" defaultValue={initialData?.user?.role || "EMPLOYEE"}>
            <option value="EMPLOYEE">employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* 4. Mobile Number */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Mobile Number
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={initialData?.phone}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* 5. Department (Select) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Department
          </label>
          <div className="relative">
            <select
              name="department"
              defaultValue={initialData?.department || ""}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((deptName) => (
                <option key={deptName} value={deptName}>
                  {deptName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6. Designation (Select) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Designation
          </label>
          <div className="relative">
            <input
              name="position"
              defaultValue={initialData?.position}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
            ></input>
          </div>
        </div>

        {/* 7. Date of Joining */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Date of Joining
          </label>
          <input
            type="date"
            name="joinDate"
            required
            defaultValue={
              initialData?.joinDate
                ? new Date(initialData.joinDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                       transition-all duration-200 outline-none text-slate-700"
          />
        </div>

        {/* 8. Salary */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Salary
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-slate-500 font-medium">₹</span>
            </div>
            <input
              type="number"
              name="basicSalary"
              defaultValue={initialData?.basicSalary || 0}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                         transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {isEditMode && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              type="number"
              name="employmentStatus"
              defaultValue={initialData?.employmentStatus}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                         transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        )}

        {/* 9. Profile Photo Upload (Spans both columns on desktop for better layout) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Profile Photo
          </label>
          // Upload Box
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 rounded-xl 
                            bg-slate-50/30 hover:bg-slate-50 transition-colors duration-200"
          >
            <div className="space-y-2 text-center">
              {/* <Upload
                              className="mx-auto h-10 w-10 text-slate-400"
                              strokeWidth={1.5}
                            /> */}
              <div className="flex text-sm text-slate-600">
                <label
                  htmlFor="profile-photo-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 
                               hover:text-purple-600 focus-within:outline-none focus-within:ring-2 
                               focus-within:ring-purple-500 transition-colors"
                >
                  <span>Click to upload image</span>
                  <input
                    id="profile-photo-upload"
                    name="profile-photo"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500">JPG, PNG, JPEG up to 5MB</p>
            </div>
          </div>
          // Image Preview
          <div className="mt-1 flex items-center space-x-5 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-100 shadow-sm">
              <img
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 truncate"></p>
              <p className="text-xs text-slate-500">(1) KB</p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 
                           hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10. Active Status Toggle */}
        <div className="md:col-span-2 flex items-center justify-between py-2 border-t border-slate-100 pt-4 mt-2">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-slate-700">
              Employee Active Status
            </label>
            <p className="text-xs text-slate-500">
              Enable or disable employee access
            </p>
          </div>
          <button
            type="button"
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          ></button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={()=>(onCancle ? onCancle(): navigate(-1))}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 bg-white 
                     text-slate-700 font-medium shadow-sm 
                     hover:bg-slate-50 hover:border-slate-400 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 
                     text-white font-medium shadow-md 
                     hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 
                     transform hover:-translate-y-0.5 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {
            loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin"/>
          }
          {
            isEditMode ? "Updat Employee" : "Create Employee"
          }
          
          
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
