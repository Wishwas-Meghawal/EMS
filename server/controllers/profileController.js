import Employee from "../models/Employee.js";
import User from "../models/User.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      // Admin user — not an employee, bio lives on the User document
      const user = await User.findById(session.userId);
      return res.json({
        employeeName: "Admin",
        email: session.email,
        role: session.role,
        bio: user?.bio || "",
      });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      // Admin user — update bio on the User document instead
      await User.findByIdAndUpdate(session.userId, {
        bio: req.body.bio,
      });
      return res.json({ success: true });
    }

    // isDeleted check pehle, return baad mein
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot update your profile",
      });
    }

    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};