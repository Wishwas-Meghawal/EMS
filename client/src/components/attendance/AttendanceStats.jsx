import { AlertCircleIcon, Calendar1Icon, ClockIcon } from 'lucide-react';
import React from 'react';

const AttendanceStat = ({ history = [] }) => {
  const totalPresent = history.filter(
    (h) => h.status === "PRESENT" || h.status === "LATE"
  ).length;

  const totalLate = history.filter((h) => h.status === "LATE").length;

  const stats = [
    {
      label: "Days Present",
      value: totalPresent,
      icon: Calendar1Icon,
      accentColor: "border-emerald-400",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      label: "Late Arrivals",
      value: totalLate,
      icon: AlertCircleIcon,
      accentColor: "border-amber-400",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      label: "Avg. Work Hrs",
      value: "8.5 Hrs",
      icon: ClockIcon,
      accentColor: "border-blue-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className={`
              group
              relative
              flex
              items-center
              gap-4
              p-6
              h-[110px]
              rounded-2xl
              bg-white
              border
              border-slate-200
              border-l-4
              ${stat.accentColor}
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
              overflow-hidden
              cursor-pointer
            `}
          >
            {/* Background Gradient Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Left Side - Icon Container */}
            <div className={`
              flex-shrink-0
              flex
              items-center
              justify-center
              w-[52px]
              h-[52px]
              rounded-xl
              ${stat.iconBg}
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:shadow-md
            `}>
              <IconComponent 
                size={24} 
                className={`${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
                strokeWidth={1.75}
              />
            </div>

            {/* Right Side - Text Content */}
            <div className="flex flex-col flex-1">
              <span className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-slate-900 font-bold text-4xl tracking-tight">
                  {stat.value}
                </span>
                {stat.label === "Avg. Work Hrs" && (
                  <span className="text-slate-400 text-sm font-medium ml-1">
                    / day
                  </span>
                )}
              </div>
            </div>

            {/* Decorative Element - Top Right */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceStat;