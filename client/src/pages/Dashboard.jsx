import React, { useState } from 'react';
import { 
  User, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  DollarSign, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Attendance', icon: Calendar },
    { name: 'Leave', icon: FileText },
    { name: 'Payslips', icon: DollarSign },
    { name: 'Settings', icon: Settings },
  ];

  const statsCards = [
    { title: 'Days Present', value: '20', icon: Calendar, accentColor: 'border-l-blue-500' },
    { title: 'Pending Leaves', value: '2', icon: FileText, accentColor: 'border-l-amber-500' },
    { title: 'Latest Payslip', value: '$2,000', icon: DollarSign, accentColor: 'border-l-emerald-500' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Section */}
      <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">Employee MS</h2>
          <p className="text-white/60 text-xs">Management System</p>
        </div>
      </div>

      {/* User Card */}
      <div className="bg-white/10 rounded-xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            J
          </div>
          <div>
            <h3 className="text-white font-semibold">John Doe</h3>
            <p className="text-white/60 text-sm">Employee</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <button className="mt-auto flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-800">Employee MS</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] shadow-2xl z-40 transform transition-transform duration-300">
            <div className="p-6 h-full overflow-y-auto">
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] min-h-screen shadow-xl sticky top-0">
          <div className="p-6 h-full">
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Spacer for mobile header */}
            <div className="h-14 lg:h-0" />

            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, John!</h1>
              <p className="text-gray-500 mt-1">Software Engineer - Engineering</p>
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
                          <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
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
              <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                <span className="relative flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark Attendance
                </span>
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Apply for Leave
              </button>
            </div>

            {/* Additional Content Area for Demo */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
              <p className="text-gray-500">Your attendance for today has been recorded. You have 2 pending leave requests awaiting approval.</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Next payroll: June 30, 2026</span>
                  <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

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

export default Dashboard;