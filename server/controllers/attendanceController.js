import { inngest } from "../inngest/index.js";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";


//Clock in/out for employee


// POST / api/attendance
// attendanceController.js

export const clockOut = async (req, res) => {
  try {
    const session = req.session;

    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot clock in/out.",
      });
    }

    const now = new Date();

    // ✅ Build a UTC-safe date range for "today"
    const startOfDay = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    );
    const endOfDay = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    );

    const existing = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfDay, $lte: endOfDay }, // ✅ range query, not exact match
    });

    if (!existing) {
      // ── CLOCK IN ──
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);

      const attendance = await Attendance.create({
        employeeId: employee._id,
        date: startOfDay,   // ✅ always store normalized midnight UTC
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });

      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id,
          attendanceId: attendance._id,
        },
      });

      return res.json({ success: true, type: "CHECK_IN", data: attendance });

    } else if (!existing.checkOut) {
      // ── CLOCK OUT ──
      const diffMs = now.getTime() - new Date(existing.checkIn).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const workingHours = parseFloat(diffHours.toFixed(2));

      let dayType;
      if (workingHours >= 8) dayType = "Full Day";
      else if (workingHours >= 6) dayType = "Three Quarter Day";
      else if (workingHours >= 4) dayType = "Half Day";
      else dayType = "Short Day";

      existing.checkOut = now;
      existing.workingHours = workingHours;
      existing.dayType = dayType;
      await existing.save();

      return res.json({ success: true, type: "CHECK_OUT", data: existing });

    } else {
      // Already clocked out
      return res.json({ success: true, type: "CHECK_OUT", data: existing });
    }

  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ error: "Operation failed" });
  }
};


//Get attendance for employee
// GET / api/attendance
export const getAttendance = async (req, res) => {
  try {
    const session = req.session;

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const limit = parseInt(
      req.query.limit || 30
    );

    const history = await Attendance.find({
      employeeId: employee._id,
    }).sort({
      date: -1,
    }).limit(limit);

    return res.json({
      data: history,
      employee: {
        isDeleted: employee.isDeleted
      }
    })
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch attendance"
    });
  }
}