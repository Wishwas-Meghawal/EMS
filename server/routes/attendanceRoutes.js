import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockOut, getAttendance } from "../controllers/attendanceController.js";


const attendanceRouter = Router();

attendanceRouter.get('/',protect, getAttendance);
attendanceRouter.post('/',protect, clockOut);

export default attendanceRouter;

