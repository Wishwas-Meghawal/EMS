import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// GET /api/employees
export const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const where = {};
    if (department) where.department = department;

    const employees = await Employee.find(where)
      .sort({ createdAt: -1 })
      .populate("userId", "email role")
      .lean();

    const result = employees.map((emp) => ({
      ...emp,
      id: emp._id.toString(),
      user: emp.userId
        ? { email: emp.userId.email, role: emp.userId.role }
        : null,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const {
      employeeName, employeeCode, email, role, password,
      phone, department, position, joinDate,
      basicSalary, allowances, deductions, bio,
    } = req.body;

    if (!email || !password || !employeeName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingCode = await Employee.findOne({ employeeCode, isDeleted: false });
    if (existingCode)
      return res.status(400).json({ success: false, message: "Employee code already exists" });

    const existingEmail = await Employee.findOne({ email, isDeleted: false });
    if (existingEmail)
      return res.status(400).json({ success: false, message: "Email already exists" });

    // ✅ User bhi pehle check karo — orphan User hoga to bhi pakad lega
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // ✅ User create karo
    const user = await User.create({
      email,
      password: hashedPass,
      role: role || "EMPLOYEE"
    });

    const profilePhoto = req.file ? req.file.path.replace(/\\/g, "/") : null;

    let employee;
    try {
      // ✅ Employee create karo
      employee = await Employee.create({
        userId: user._id,
        employeeName, employeeCode, email, phone,
        department: department || "Engineering",
        position,
        joinDate: new Date(joinDate),
        basicSalary: Number(basicSalary) || 0,
        allowances: Number(allowances) || 0,
        deductions: Number(deductions) || 0,
        bio: bio || "",
        profilePhoto,
      });
    } catch (empError) {
      // ✅ Employee create fail hua to User bhi delete karo — orphan nahi rehna chahiye
      await User.findByIdAndDelete(user._id);
      throw empError; // catch block mein jayega
    }

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message
    });
  }
};

// PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeName, employeeCode, email, role, password,
      phone, department, position, joinDate,
      basicSalary, allowances, deductions, bio, employeeStatus,
    } = req.body;

    const existingCode = await Employee.findOne({ employeeCode, isDeleted: false, _id: { $ne: id } });
    if (existingCode)
      return res.status(400).json({ success: false, message: "Employee code already exists" });

    const existingEmail = await Employee.findOne({ email, isDeleted: false, _id: { $ne: id } });
    if (existingEmail)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee Not Found" });

    // ✅ Use new photo if uploaded, otherwise keep existing
    const profilePhoto = req.file
      ? req.file.path.replace(/\\/g, "/")
      : employee.profilePhoto;

    await Employee.findByIdAndUpdate(id, {
      employeeName, employeeCode, email, phone,
      department: department || "Engineering",
      position,
      joinDate: new Date(joinDate),
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      employeeStatus: employeeStatus || "ACTIVE",
      bio: bio || "",
      profilePhoto,   // ✅
    });

    const userUpdate = { email };
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(employee.userId, userUpdate);

    return res.json({ success: true });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    return res.status(500).json({ success: false, message: "Failed to update employee", error: error.message });
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ _id: id, isDeleted: false });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    employee.isDeleted = true;
    employee.employeeStatus = "INACTIVE";
    await employee.save();

    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid employee ID format" });
    }
    return res.status(500).json({ success: false, message: "Failed to delete employee", error: error.message });
  }
};