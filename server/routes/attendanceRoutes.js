import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockOut, getAttendance } from "../controllers/attendanceController.js";


const attendanceRouter = Router();

attendanceRouter.post('/',protect, clockOut);
attendanceRouter.post('/',protect, getAttendance);

export default attendanceRouter;

