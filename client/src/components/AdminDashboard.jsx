import React from "react";
import { Building2Icon, Calendar, FileTextIcon, Menu, User } from "lucide-react";

const AdminDashboard = ({ data }) => {
  const statsCards = [
    {
      label: "Total Employees",
      value: data.totalEmployees,
      icon: User,
      accentColor: "border-l-blue-500",
      description: "All workforce",
    },
    {
      label: "Total Departments",
      value: data.totalDepartments,
      icon: Building2Icon,
      accentColor: "border-l-blue-500",
      description: "Organizational units",
    },
    {
      label: "Today's Attendance",
      value: data.todayAttendance,
      icon: Calendar,
      accentColor: "border-l-blue-500",
      description: "Current day presence",
    },
    {
      label: "Pending Leaves",
      value: data.pendingLeaves,
      icon: FileTextIcon,
      accentColor: "border-l-blue-500",
      description: "Leave requests",
    },
  ];
  return (
   <div className="bg-gray-50 font-sans antialiased">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
            <Menu className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-800">Employee MS</span>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Spacer for mobile header */}
            <div className="h-14 lg:h-0" />

            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back, Admin - Here's an overview of your organization's
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statsCards.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 overflow-hidden group"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">
                            {s.label}
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {s.value}
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

           

            {/* Additional Content Area for Demo */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Activity
              </h3>
              <p className="text-gray-500">
                Your attendance for today has been recorded. You have 2 pending
                leave requests awaiting approval.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Next payroll: June 30, 2026
                  </span>
                  <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </main>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
