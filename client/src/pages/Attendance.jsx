import React, { useCallback, useEffect, useState } from "react";
import { dummyAttendanceData } from "../assets/assets";
import Loading from "../components/Loading";
import { CheckIcon } from "lucide-react";
import CheckInButton from "../components/attendance/CheckInButton";
import AttendanceStat from "../components/attendance/AttendanceStats";
import AttendanceHistory from "../components/attendance/AttendanceHistory";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchData = useCallback(async () => {
    setHistory(dummyAttendanceData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecord = history.find(
    (r) => new Date(r.date).toDateString() === today.toDateString(),
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Track your work hours and daily check-ins
        </p>
      </div>

      {/* Deleted Warning OR Check In Button */}
      {isDeleted ? (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 shadow-sm">
          <div className="flex-shrink-0">{/* Warning Icon */}</div>

          <div>
            <h3 className="text-sm font-semibold text-red-700">
              Employee Record Deleted
            </h3>

            <p className="mt-1 text-sm text-red-600 leading-relaxed">
              You can no longer clock in or clock out because this employee
              record has been marked as deleted.
            </p>
          </div>
        </div>
      ) : (
        <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
      )}

      {/* Attendance Stats */}
      <AttendanceStat history={history} />

      {/* Attendance History */}
      <AttendanceHistory history={history} />
    </div>
  );
};

export default Attendance;
