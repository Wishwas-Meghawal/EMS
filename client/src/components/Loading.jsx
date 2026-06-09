// src/components/Loading.jsx (Pure Tailwind - No custom CSS)
import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Clock, Shield, UserCog } from 'lucide-react';

const Loading = ({ message = "Please wait while we prepare your workspace." }) => {
  const rotatingIcons = [Users, Briefcase, Clock, Shield, UserCog];
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % rotatingIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = rotatingIcons[currentIconIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse [animation-delay:700ms]"></div>
      </div>

      {/* Loading Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200/50 max-w-md mx-4">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-xl shadow-lg p-4 mb-4">
            <Users className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Employee MS
          </h1>
          <p className="text-xs text-gray-500 mt-1">Management System</p>
        </div>

        {/* Simple Spinner - Pure Tailwind */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {/* Single clean spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-200/50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-indigo-600 border-b-pink-600 border-l-transparent animate-spin"></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CurrentIcon className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <h3 className="text-lg font-semibold text-gray-800 animate-pulse">
              Loading...
            </h3>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce [animation-delay:150ms]"></div>
          </div>
          
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            {message}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse [animation-delay:150ms]"></div>
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse [animation-delay:300ms]"></div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex justify-center gap-1">
            <div className="h-0.5 w-6 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
            <div className="h-0.5 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <div className="h-0.5 w-6 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;