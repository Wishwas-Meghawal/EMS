const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // Employee Reference
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    // Attendance Date
    attendanceDate: {
      type: Date,
       required: true
    },

    // Check-In Time
    checkInTime: {
      type: Date,
      default: "",
    },

    // Check-Out Time
    checkOutTime: {
      type: Date,
      default: "",
    },

    // Attendance Status
    status: {
      type: String,
      required: [true, "Attendance status is required"],
      enum: {
        values: [
          "PRESENT",
          "ABSENT",
          "LATE",
          "LEAVE",
        ],
        message: "Invalid attendance status",
      },
      default: "PRESENT",
    },
    workingHours:{
      type: Number,
      default: null
    },
    datType: {
      type:String,
      enum: [
        "Full Day",
        "Three Quarter Day",
        "Half Day",
        "Sort Day",
        null
      ],
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// Prevent multiple attendance records for the same employee on the same date
attendanceSchema.index(
  {
    employeeId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;