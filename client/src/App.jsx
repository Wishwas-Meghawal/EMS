import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginLanding from "./pages/LoginLanding";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import { Settings } from "lucide-react";
import Payslips from "./pages/Payslips";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import Employee from "./pages/Employee";
import PrintPayslip from "./pages/PrintPayslip";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />}/>
        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to access your account" />}/>
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to access your account" />}/>


          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/print/payslips/:id" element={<PrintPayslip />}/>
          <Route path="*" element={<Navigate to="/dashboard" replace/>} />
      </Routes>
    </>
  );
};

export default App;
