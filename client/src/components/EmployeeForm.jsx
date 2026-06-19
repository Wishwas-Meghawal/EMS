import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2Icon,
  Plus,
  X,
  Upload,
  User,
  KeyRound,
  Briefcase,
  Wallet,
  FileText,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Backend ke server/constants/department.js se exactly match karta hai
const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "IT Support",
  "Customer Success",
  "Product Management",
  "Design",
];

// ==========================================
// 🛡️ ZOD RUNTIME VALIDATION SCHEMA
// ==========================================
const createValidationSchema = (isEditMode) => {
  return z.object({
    employeeName: z
      .string()
      .min(1, "Employee Name is required")
      .transform((val) => val.trim())
      .refine((val) => val.length >= 3 && val.length <= 50, "Name must be between 3 and 50 characters")
      .refine((val) => /^[a-zA-Z\s]+$/.test(val), "Only alphabets and spaces are allowed"),
    
    employeeCode: z
      .string()
      .min(1, "Employee Code is required")
      .max(10, "Employee Code must be at most 10 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters allowed")
      .transform((val) => val.toUpperCase()),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Must be a valid email address")
      .transform((val) => val.toLowerCase()),

    password: isEditMode
      ? z
          .string()
          .optional()
          .transform((val) => (val === "" ? undefined : val))
          .refine(
            (val) =>
              !val ||
              (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(val)),
            {
              message: "Password must be 8-20 characters and contain an uppercase, lowercase, number, and special character",
            }
          )
      : z
          .string()
          .min(1, "Temporary Password is required")
          .min(8, "Password must be at least 8 characters")
          .max(20, "Password must be at most 20 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
            "Password must contain an uppercase, lowercase, number, and special character"
          ),

    role: z.enum(["ADMIN", "EMPLOYEE"]),
    
    phone: z
      .string()
      .min(1, "Mobile Number is required")
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits containing numbers only"),
    
    department: z.enum(DEPARTMENTS, {
      errorMap: () => ({ message: "Please select a valid department" }),
    }),
    
    position: z
      .string()
      .min(1, "Designation is required")
      .min(3, "Designation must be at least 3 characters")
      .max(50, "Designation cannot exceed 50 characters"),
    
    joinDate: z
      .string()
      .min(1, "Date of joining is required")
      .refine((val) => {
        const inputDate = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Allow registration up to today midnight
        return inputDate <= today;
      }, "Join date cannot be a future date"),
    
    basicSalary: z
      .preprocess((val) => Number(val), z.number().min(0, "Salary cannot be negative")),
    
    allowances: z
      .preprocess((val) => (val === "" ? 0 : Number(val)), z.number().min(0, "Allowances cannot be negative"))
      .default(0),
    
    deductions: z
      .preprocess((val) => (val === "" ? 0 : Number(val)), z.number().min(0, "Deductions cannot be negative"))
      .default(0),
    
    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters")
      .optional()
      .default(""),
    
    employeeStatus: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  });
};

// Reusable section header — matches the "Public Profile" header style used elsewhere in the app
const SectionHeader = ({ icon: Icon, title }) => (
  <h3 className="text-base font-medium text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
    <Icon className="w-5 h-5 text-slate-400" />
    {title}
  </h3>
);

const EmployeeForm = ({ initialData, onSuccess, onCancle }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData;

  // 📝 Manage profile picture states manually
  const fileInputRef = useRef(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    initialData?.profilePhoto ? `${API_URL}/${initialData.profilePhoto}` : null
  );
  const [photoError, setPhotoError] = useState("");

  const schema = createValidationSchema(isEditMode);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: initialData?.user?.role || "EMPLOYEE",
      department: initialData?.department || "",
      employeeStatus: initialData?.employeeStatus || "ACTIVE",
      basicSalary: initialData?.basicSalary ?? 0,
      allowances: initialData?.allowances ?? 0,
      deductions: initialData?.deductions ?? 0,
    },
  });

  // Hydrate form defaults if structural properties exist (e.g., Dates)
  useEffect(() => {
    if (initialData) {
      if (initialData.joinDate) {
        setValue("joinDate", new Date(initialData.joinDate).toISOString().split("T")[0]);
      }
      setValue("employeeName", initialData.employeeName);
      setValue("employeeCode", initialData.employeeCode);
      setValue("email", initialData.email);
      setValue("phone", initialData.phone);
      setValue("position", initialData.position);
      setValue("bio", initialData.bio || "");
    }
  }, [initialData, setValue]);

  // Handle Photo File Validations
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError("");
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photo must be under 5MB");
      e.target.value = "";
      return;
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Only JPG, JPEG, PNG files are allowed");
      e.target.value = "";
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(initialData?.profilePhoto ? `${API_URL}/${initialData.profilePhoto}` : null);
    setPhotoError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // On Valid Submission
  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Map all text data fields down into multi-part form payloads
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      // Append verified files safely
      if (photoFile) {
        formData.append("profilePhoto", photoFile);
      }

      const url = isEditMode ? `/employee/${initialData._id}` : "/employee";
      const method = isEditMode ? "put" : "post";

      const response = await api[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        toast.success(isEditMode ? "Employee updated successfully!" : "Employee created successfully!");
        onSuccess ? onSuccess() : navigate("/employee");
      }
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        // Backend ne field-wise errors bheje hain — har ek ko uske input ke
        // neeche dikhao, generic toast ki jagah
        backendErrors.forEach((err) => {
          if (err.field) {
            setError(err.field, { type: "server", message: err.message });
          }
        });
        toast.error("Please fix the highlighted fields below");
      } else {
        toast.error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong processing your request."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // CSS Style helpers to dynamically build conditional UI borders
  const getInputClasses = (fieldName) => `
    w-full px-4 py-2.5 rounded-xl border bg-white shadow-sm
    focus:ring-2 focus:ring-purple-500 focus:border-transparent
    transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400
    ${errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-slate-200"}
  `;

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmitHandler)}>

      {/* ===================== Basic Details ===================== */}
      <div>
        <SectionHeader icon={User} title="Basic Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Employee Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input type="text" {...register("employeeName")} className={getInputClasses("employeeName")} />
            {errors.employeeName && <p className="text-xs text-red-500 mt-1">{errors.employeeName.message}</p>}
          </div>

          {/* Employee Code */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Employee Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="EMP001"
              {...register("employeeCode")}
              className={getInputClasses("employeeCode")}
            />
            {errors.employeeCode && <p className="text-xs text-red-500 mt-1">{errors.employeeCode.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input type="email" {...register("email")} className={getInputClasses("email")} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input type="tel" placeholder="9876543210" {...register("phone")} className={getInputClasses("phone")} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* ===================== Credentials & Access ===================== */}
      <div>
        <SectionHeader icon={KeyRound} title="Credentials & Access" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              {isEditMode ? "Change Password" : "Password"} {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              placeholder={isEditMode ? "Leave blank to keep current" : "••••••••"}
              {...register("password")}
              className={getInputClasses("password")}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">System Role</label>
            <select {...register("role")} className={getInputClasses("role")}>
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
          </div>
        </div>
      </div>

      {/* ===================== Job Details ===================== */}
      <div>
        <SectionHeader icon={Briefcase} title="Job Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Department */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select {...register("department")} className={getInputClasses("department")}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Designation <span className="text-red-500">*</span>
            </label>
            <input type="text" {...register("position")} className={getInputClasses("position")} />
            {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
          </div>

          {/* Join Date */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Date of Joining <span className="text-red-500">*</span>
            </label>
            <input type="date" {...register("joinDate")} className={getInputClasses("joinDate")} />
            {errors.joinDate && <p className="text-xs text-red-500 mt-1">{errors.joinDate.message}</p>}
          </div>

          {/* Status — edit mode only */}
          {isEditMode && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select {...register("employeeStatus")} className={getInputClasses("employeeStatus")}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              {errors.employeeStatus && <p className="text-xs text-red-500 mt-1">{errors.employeeStatus.message}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ===================== Compensation ===================== */}
      <div>
        <SectionHeader icon={Wallet} title="Compensation" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {/* Salary */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Basic Salary <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 font-medium">₹</span>
              <input type="number" {...register("basicSalary")} className={`${getInputClasses("basicSalary")} pl-8`} />
            </div>
            {errors.basicSalary && <p className="text-xs text-red-500 mt-1">{errors.basicSalary.message}</p>}
          </div>

          {/* Allowances */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Allowances</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 font-medium">₹</span>
              <input type="number" {...register("allowances")} className={`${getInputClasses("allowances")} pl-8`} />
            </div>
            {errors.allowances && <p className="text-xs text-red-500 mt-1">{errors.allowances.message}</p>}
          </div>

          {/* Deductions */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Deductions</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 font-medium">₹</span>
              <input type="number" {...register("deductions")} className={`${getInputClasses("deductions")} pl-8`} />
            </div>
            {errors.deductions && <p className="text-xs text-red-500 mt-1">{errors.deductions.message}</p>}
          </div>
        </div>
      </div>

      {/* ===================== Bio Statement ===================== */}
      <div>
        <SectionHeader icon={FileText} title="Bio Statement" />
        <textarea
          rows={3}
          {...register("bio")}
          placeholder="Tell us a bit about professional backgrounds..."
          className={getInputClasses("bio")}
        />
        {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
      </div>

      {/* ===================== Profile Photo ===================== */}
      <div>
        <SectionHeader icon={Camera} title="Profile Photo" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handlePhotoChange}
          className="hidden"
        />

        {!photoPreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/30 hover:bg-indigo-50/40 hover:border-indigo-400 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-600">Click to upload photo</p>
              <p className="text-xs text-slate-400 mt-0.5">JPG, JPEG, PNG — max 5MB</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
            <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden ring-2 ring-purple-200 shadow-sm">
              <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{photoFile?.name || "Current image file"}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {photoFile ? `${(photoFile.size / 1024).toFixed(1)} KB` : "Stored File Server Asset"}
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
              className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {photoError && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><X className="w-3 h-3" /> {photoError}</p>}
      </div>

      {/* Form CTA Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => (onCancle ? onCancle() : navigate(-1))}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;