import Employee from "../models/Employee.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      // Admin user — not an employee
      return res.json({
        employeeName: "Admin",  // ✅ typo fix
        email: session.email,
        role: session.role,
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
      return res.status(404).json({ error: "Employee not found" });
    }

    // ✅ isDeleted check pehle, return baad mein
    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot update your profile",
      });
    }

    // ✅ Ab update hoga — pehle nahi hota tha
    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });

    return res.json({ success: true }); // ✅ josn → json
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};