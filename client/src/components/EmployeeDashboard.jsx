import React from "react";
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckCircle,
  Menu,
  ChevronRight
} from 'lucide-react';
import { Link } from "react-router-dom";

const EmployeeDashboard = ({ data }) => {
  const emp = data.employee;

  const statsCards = [
    {
      title: "Days Present",
      value: data.currentMonthAttendance,
      icon: Calendar,
      accentColor: "border-l-blue-500",
      subtitle: "This month",
    },
    {
      title: "Pending Leaves",
      value: data.pendingLeaves,
      icon: FileText,
      accentColor: "border-l-amber-500",
      subtitle: "Awaiting approval",
    },
    {
      title: "Latest Payslip",
      value: data.latestPayslip ? `$${data.latestPayslip.netSalary?.toLocaleString()}` : "N/A",
      icon: DollarSign,
      accentColor: "border-l-emerald-500",
      subtitle: "Most recent payout",
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
                Welcome, {
                  emp.firstName && emp.lastName
                    ? `${emp.firstName} ${emp.lastName}`
                    : "Employee"
                }
              </h1>
              <p className="text-gray-500 mt-1">
                {emp.position} -{emp.department || "No Department"} 
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 overflow-hidden group"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium mb-1">
                            {card.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-800">
                            {card.value}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/attendance" className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                <span className="relative flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark Attendance
                </span> 
              </Link>
              <Link to="/leave" className="inline-flex items-center justify-center px-6 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Apply for Leave
              </Link>
            </div>

            {/* Additional Content Area for Demo */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
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
            </div>
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

export default EmployeeDashboard;
