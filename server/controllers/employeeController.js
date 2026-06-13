const Employee = require("../models/Employee.js");
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { hash } from "crypto";
import { error } from "console";


// Get Employee
//GET/ api/ employees
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
      user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
    }))
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// Create Employee
//POST /api/employee
export const createEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeCode,
      email,
      password,
      phone,
      department,
      position,
      joinDate,
      basicSalary,
      allowances,
      deductions,
      employeeStatus,
      bio,
    } = req.body;

    // ── Duplicate checks ──────────────────────────────────────────
    const existingCode = await Employee.findOne({ employeeCode, isDeleted: false });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "Employee code already exists",
      });
    }

    const existingEmail = await Employee.findOne({ email, isDeleted: false });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

  
    if (!email || !password || !employeeName) {
      return res.status(400).json({
        error: "Missing required fields";
      })
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPass,
      role: role || "EMPLOYEE"
    })

    // ── Create employee ───────────────────────────────────────────
    const employee = await Employee.create({
      userId: user._id,
      employeeName,
      employeeCode,
      email,
      phone,
      department: department || "Engineering",
      position,
      joinDate: new Date(joinDate),
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(basicSalary) || 0,
      deductions: Number(basicSalary) || 0,
      bio: bio || "",
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });

  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};


// Update Employee
//PUT /api/employee/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeName,
      employeeCode,
      email,
      password,
      phone,
      department,
      position,
      basicSalary,
      allowances,
      deductions,
      bio,
      employeeStatus
    } = req.body;

    // ── Duplicate checks ──────────────────────────────────────────
    const existingCode = await Employee.findOne({ employeeCode, isDeleted: false });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "Employee code already exists",
      });
    }

    const existingEmail = await Employee.findOne({ email, isDeleted: false });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }




    const employee = await Employee.findById(id);
    if (!employee) {
      return (
        res.status(404).json({
          error: "Employee Not Found";
        })
      )
    }



    // ── Update employee ───────────────────────────────────────────
    await Employee.findByIdAndUpdate(id, {
      employeeName,
      employeeCode,
      email,
      phone,
      department: department || "Engineering",
      position,
      joinDate: new Date(joinDate),
      basicSalary: Number(basicSalary) || 0,
      allowances: Number(basicSalary) || 0,
      deductions: Number(basicSalary) || 0,
      //profilePhoto,
      employeeStatus: employeeStatus || "ACTIVE",
      bio: bio || "",
    });

    // Update user record
    const userUpdate = { email }
    if (role) userUpdate.role = role;
    if (password) userUpdate.password = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(employee.userid, userUpdate)



    return res.json({
      success: true,
    });

  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// Delete Employee
//DELETE /api/employee/:id

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.isDeleted = true;
    employee.employeeStatus = "INACTIVE";

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};
