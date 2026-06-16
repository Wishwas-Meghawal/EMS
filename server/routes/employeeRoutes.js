import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController.js";
import { protect, protectAdmin } from "../middleware/auth.js";
import { uploadSingle } from "../middleware/upload.js";


const employeesRouter = Router();

employeesRouter.get("/", protect,protectAdmin,getEmployees);
employeesRouter.post("/", protect,protectAdmin,uploadSingle("profilePhoto"),createEmployee);
employeesRouter.put("/:id", protect,protectAdmin,uploadSingle("profilePhoto"),updateEmployee);
employeesRouter.delete("/:id", protect,protectAdmin,deleteEmployee);

export default employeesRouter;