import { Loader2Icon, Plus, X, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";
import toast from "react-hot-toast";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EmployeeForm = ({ initialData, onSuccess, onCancle }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  // ✅ Photo state
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    initialData?.profilePhoto ? `${API_URL}/${initialData.profilePhoto}` : null,
  );
  const [photoError, setPhotoError] = useState("");

  // ✅ Handle photo selection with validation
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError("");
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo must be under 5MB");
      e.target.value = "";
      return;
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Only JPG, JPEG, PNG files are allowed");
      e.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file)); // ✅ live preview
  };

  // ✅ Remove selected photo
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(
      initialData?.profilePhoto
        ? `${API_URL}/${initialData.profilePhoto}`
        : null,
    );
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Manually FormData banao — e.currentTarget mat use karo
      // Kyunki e.currentTarget file input bhi pick karta hai = duplicate field
      const formData = new FormData();

      // Text fields manually append karo
      const fields = [
        "employeeName",
        "employeeCode",
        "email",
        "phone",
        "department",
        "position",
        "joinDate",
        "basicSalary",
        "allowances",
        "deductions",
        "bio",
        "role",
        "employeeStatus",
      ];

      fields.forEach((field) => {
        const el = e.currentTarget.elements[field];
        if (el && el.value !== "") {
          formData.append(field, el.value);
        }
      });

      // Password — sirf append karo agar filled ho
      const pwd = e.currentTarget.elements["password"]?.value;
      if (pwd) formData.append("password", pwd);

      // ✅ Photo — sirf ek baar, controlled state se
      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      const url = isEditMode ? `/employee/${initialData._id}` : "/employee";
      const method = isEditMode ? "put" : "post";

      await api[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(isEditMode ? "Employee updated!" : "Employee created!");
      onSuccess ? onSuccess() : navigate("/employee");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handelSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Employee Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="employeeName"
            required
            defaultValue={initialData?.employeeName}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Employee Code */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Employee Code
          </label>
          <input
            type="text"
            name="employeeCode"
            placeholder="EMP001"
            maxLength={10}
            defaultValue={initialData?.employeeCode}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Email */}
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

        {/* Password */}
        {!isEditMode ? (
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
                         transition-all duration-200 outline-none text-slate-700"
            />
          </div>
        ) : (
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

        {/* Role */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            System Role
          </label>
          <select
            name="role"
            defaultValue={initialData?.user?.role || "EMPLOYEE"}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 outline-none text-slate-700"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Phone */}
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

        {/* Department */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Department
          </label>
          <select
            name="department"
            defaultValue={initialData?.department || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 outline-none text-slate-700"
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Designation
          </label>
          <input
            name="position"
            defaultValue={initialData?.position}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Join Date */}
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

        {/* Salary */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Salary
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 font-medium">
              ₹
            </span>
            <input
              type="number"
              name="basicSalary"
              defaultValue={initialData?.basicSalary || 0}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 outline-none text-slate-700"
            />
          </div>
        </div>

        {/* Status — edit mode only */}
        {isEditMode && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              name="employeeStatus"
              defaultValue={initialData?.employeeStatus || "ACTIVE"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 outline-none text-slate-700"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        )}

        {/* ✅ Profile Photo Upload with Live Preview */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Profile Photo
          </label>

          {/* Upload trigger — hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {!photoPreview ? (
            /* Drop zone — shown when no photo selected */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 px-6 py-8 border-2
                         border-dashed border-slate-300 rounded-xl bg-slate-50/30
                         hover:bg-indigo-50/40 hover:border-indigo-400 transition-all
                         duration-200 cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100
                              flex items-center justify-center transition-colors"
              >
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                  Click to upload photo
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  JPG, JPEG, PNG — max 5MB
                </p>
              </div>
            </div>
          ) : (
            /* ✅ Live preview — shown after photo selected */
            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div
                className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden
                              ring-2 ring-purple-200 shadow-sm"
              >
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {photoFile?.name || "Current photo"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {photoFile
                    ? `${(photoFile.size / 1024).toFixed(1)} KB`
                    : "Uploaded"}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-500 hover:text-indigo-700 mt-1 underline"
                >
                  Change photo
                </button>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400
                           hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ✅ Validation error */}
          {photoError && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <X className="w-3 h-3" /> {photoError}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => (onCancle ? onCancle() : navigate(-1))}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 bg-white
                     text-slate-700 font-medium shadow-sm hover:bg-slate-50 hover:border-slate-400
                     transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600
                     to-indigo-600 text-white font-medium shadow-md hover:shadow-lg
                     hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5
                     transition-all duration-200 flex items-center justify-center gap-2
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isEditMode ? "Update Employee" : "Create Employee"}{" "}
          {/* ✅ typo fixed */}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
