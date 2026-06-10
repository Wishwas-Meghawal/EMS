import React, { useEffect, useState } from "react";
import {
  User,
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { href, Link, useLocation } from "react-router-dom";
import { dummyProfileData } from "../assets/assets";

const Sidebar = ({ activeMenu, setActiveMenu, isOpen, onClose }) => {
  

  const { pathname } = useLocation();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState("");

  useEffect(() => {
    setUserName(dummyProfileData.firstName + " " + dummyProfileData.lastName);
  }, []);

  // Close mobile sidebar on route change

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const role = "" || "EMPLOYEE";

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    role === "ADMIN" ?
    { name: "Employees", icon: User, href: "/employee" }:
    { name: "Attendance", icon: Calendar, href: "/attendance" },
    { name: "Leave", icon: FileText, href: "/leave" },
    { name: "Payslips", icon: DollarSign, href: "/payslips" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleLogout = () =>{
    window.location.href = "/login";
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Section */}
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">
            Employee MS
          </h2>
          <p className="text-white/60 text-xs">Management System</p>
        </div>
      </div>

      {/* User Card */}
      {userName && (
        <div className="bg-white/10 rounded-xl p-4 mb-8 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold">{userName}</h3>
            <p className="text-white/60 text-sm">{role === "ADMIN" ? "Administrator" : "Employee"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-white"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <button onClick={handleLogout} className="mt-auto flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] min-h-screen shadow-xl sticky top-0">
        <div className="p-6 h-full">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <>
          {/* Mobile hamburger button */}
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] shadow-2xl z-40 transform transition-transform duration-300">
            <div className="p-6 h-full overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
