import React from "react";
import {
  ArrowRight,
  Briefcase,
  Users,
  Clock,
  Shield,
  Building2,
  UserCircle,
} from "lucide-react";
import LoginLeftSide from "../components/LoginLeftSide";
import { Link } from "react-router-dom";

const PortalSelection = () => {
  const portals = [
    {
      to: "/login/admin",
      title: "Admin Portal",
      description:
        "Manage employees, oversee operations, and access administrative controls.",
      icon: Building2,
      role: "admin",
    },
    {
      to: "/login/employee",
      title: "Employee Portal",
      description:
        "View attendance, request leave, access payslips, and manage your profile.",
      icon: UserCircle,
      role: "employee",
    },
  ];

  const handlePortalSelect = (portal) => {
    // Handle portal selection navigation
    console.log(`Selected portal: ${portal.title}`);
    // You can implement navigation logic here
    // Example: window.location.href = portal.path;
  };

  return (
    <div className="h-screen bg-gray-50 font-sans antialiased overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding Section */}
        <LoginLeftSide />

        {/* Right Side - Portal Selection Section */}
        <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 bg-white">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500">
                Select your portal to securely access the system.
              </p>
            </div>

            {/* Portal Cards */}
            <div className="space-y-4">
              {portals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <Link
                    key={portal.to}
                    to={portal.to}
                    className="w-full group bg-gray-50 hover:bg-white rounded-xl p-6 transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:bg-purple-50 flex-shrink-0">
                          <Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" />
                        </div>

                        {/* Text Content */}
                        <div className="text-left flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                            {portal.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
                            {portal.description}
                          </p>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-purple-600 group-hover:shadow-md transition-all duration-300 flex-shrink-0 ml-4">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Need help? Contact your system administrator
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Footer - Bottom Right Section (visible only on mobile) */}
        <div className="lg:hidden bg-white py-4 px-6 border-t border-gray-100">
          <p className="text-gray-400 text-xs text-center">
            © 2026 GreatStack. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
