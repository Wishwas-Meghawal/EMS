// PayslipList.jsx

import { CalendarDays, DownloadIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom"; // ✅ add karo

const PayslipList = ({ payslips, isAdmin }) => {
  const navigate = useNavigate(); // ✅

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payslips.length > 0 ? (
              payslips.map((payslip) => (
                <tr
                  key={payslip._id || payslip.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group"
                  style={{ height: "70px" }}
                >
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <span className="text-slate-900 font-semibold">
                        {payslip?.employee?.employeeName || "—"}
                      </span>
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                      <span className="text-slate-600 font-medium">
                        {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-semibold">
                      ₹{payslip.basicSalary?.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-slate-700 font-semibold">
                      ₹{payslip.netSalary?.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {/* ✅ window.open nahi — navigate karo same tab mein */}
                    <button
                      onClick={() => navigate(`/print/payslips/${payslip._id || payslip.id}`)}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl
                                 bg-gradient-to-r from-purple-600 to-indigo-600
                                 text-white font-medium text-sm shadow-md
                                 hover:shadow-xl hover:-translate-y-0.5
                                 transition-all duration-300 focus:outline-none
                                 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <CalendarDays size={40} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-slate-900 font-semibold text-lg mb-1">
                      No payslips found
                    </h3>
                    <div className="mt-4 flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipList;