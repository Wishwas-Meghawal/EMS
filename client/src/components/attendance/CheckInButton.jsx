import React, { useState } from "react";
import { Loader2Icon, LogIn, LogInIcon, LogOutIcon } from "lucide-react";

const CheckInButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false);

  const handleAttendance = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAction();
    }, 1000);

    if (todayRecord?.checkOut) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Wrok Day Completed
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Greate job! you tomorrow
          </p>
        </div>
      );
    }
  };
  const isCheckdIn = !!todayRecord?.isCheckedIn;
  return (
    <div className="absolute bottom-4 right-4 z-10">
      <button
        onClick={handleAttendance}
        disabled={loading}
        className="
      group
      relative
      flex
      items-center
      justify-center
      gap-3
      px-4
      py-3
      min-w-[160px]
      rounded-xl
      bg-gradient-to-r
      from-violet-600
      via-purple-600
      to-blue-600
      bg-[length:200%_100%]
      shadow-md
      shadow-purple-500/20
      hover:shadow-xl
      hover:shadow-purple-500/40
      transition-all
      duration-500
      hover:-translate-y-1
      cursor-pointer
      focus:outline-none
      focus:ring-2
      focus:ring-violet-400
      focus:ring-offset-2
      focus:ring-offset-gray-900
      overflow-hidden
      before:absolute
      before:inset-0
      before:bg-gradient-to-r
      before:from-white/20
      before:via-transparent
      before:to-transparent
      before:-translate-x-full
      before:transition-transform
      before:duration-700
      hover:before:translate-x-full
      active:scale-95
    "
        aria-label={
          loading
            ? "Processing"
            : isCheckdIn
              ? "Clock out to end your shift"
              : "Clock in to start your work day"
        }
        disabled={loading}
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-white/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Left Side - Icon with Pulse Effect */}
        <div className="flex-shrink-0 relative">
          <div
            className={`
          absolute inset-0 rounded-full bg-white/20 blur-lg
          ${!loading && !isCheckdIn ? "animate-ping" : ""}
          ${!loading && !isCheckdIn ? "opacity-75" : "opacity-0"}
          transition-opacity duration-300
        `}
          />
          <div className="relative">
            {loading ? (
              <Loader2Icon className="size-5 text-white animate-spin" />
            ) : isCheckdIn ? (
              <LogOutIcon className="size-5 text-white transition-transform group-hover:scale-110 duration-300" />
            ) : (
              <LogInIcon className="size-5 text-white transition-transform group-hover:scale-110 duration-300" />
            )}
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="flex flex-col items-center justify-center relative z-10">
          <h3 className="text-white font-bold text-sm tracking-tight">
            {loading ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-pulse">Processing</span>
                <span className="animate-bounce">.</span>
              </span>
            ) : isCheckdIn ? (
              "Clock Out"
            ) : (
              "Clock In"
            )}
          </h3>
          <p className="text-white/70 text-[10px] font-medium tracking-wide uppercase">
            {isCheckdIn ? "End your shift" : "Start your day"}
          </p>
        </div>
      </button>
    </div>
  );
};

export default CheckInButton;
