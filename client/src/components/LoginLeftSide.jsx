
import React from 'react';
import { Briefcase, Users, Clock, Shield } from 'lucide-react';

const LoginLeftSide = () => {
  return (
    <div className="lg:w-1/2 w-full bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12 xl:p-16">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">HRMS</h2>
              <p className="text-white/50 text-xs">Enterprise Suite</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Employee Management System
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
            </p>
            
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 hidden lg:block">
          <p className="text-white/40 text-sm">© 2026 GreatStack. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftSide;