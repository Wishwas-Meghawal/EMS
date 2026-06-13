const mongoose = require("mongoose");
const { DEPARTMENTS } = require("../constants/department.js");

const employeeSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },

    employeeCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      trim: true,
      maxlength: [10, "Employee code must be at most 10 characters"],
      match: [/^[a-zA-Z0-9]+$/, "Employee code must be alphanumeric only"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      enum:DEPARTMENTS,
    },

    position: {
      type: String,
      required: [true, "Designation is required"],
    },

    joinDate: {
      type: Date,
      required: [true, "Date of joining is required"],
    },

    basicSalary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
      default: 0
    },
    allowances: {
      type: Number,
      required: true,
      default: 0
    },
    deductions: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    profilePhoto: {
      type: String, // stores file path or URL after upload
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true; // optional field
          return /\.(jpg|jpeg|png)$/i.test(value);
        },
        message: "Profile photo must be a JPG, JPEG, or PNG file",
      },
    },

    employeeStatus: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE"
      ],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default : false
    },
    bio:{
      type: String,
      default: ""
    },
  },

  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;