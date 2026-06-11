import { DownloadIcon } from "lucide-react";
import React from "react";
import { format } from "date-fns";

const PayslipList = ({ payslips, isAdmin }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="table-modern">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {payslips.length > 0 ? (
              payslips.map((payslip) => {
                return (
                  <tr
                    key={payslip._id || payslip.id}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group"
                    style={{ height: "70px" }}
                  >
                    {/* Date Column */}
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">
                            {payslip.employee?.firstName}{" "}
                            {payslip.employee?.lastName}
                          </span>
                        </div>
                      </td>
                    )}

                    

                    {/* Check Out Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-600 font-medium">
                          {format(
                            new Date(payslip.year, payslip.month - 1),
                            "MMMM yyyy ",
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-semibold">
                          ${payslip.basicSalary?.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-semibold">
                          ${payslip.netSalary?.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-semibold">
                          <button
                            onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`)}
                            className="
                            inline-flex items-center
                            px-4 py-2.5
                            rounded-xl
                            bg-gradient-to-r from-purple-600 to-indigo-600
                            text-white
                            font-medium
                            text-sm
                            shadow-md
                            hover:shadow-xl
                            hover:-translate-y-0.5
                            transition-all duration-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-purple-500
                            focus:ring-offset-2
                          "
                          >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Download
                          </button>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={isAdmin ? 5 : 4}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <CalendarDays
                        size={40}
                        className="text-slate-300"
                        strokeWidth={1.5}
                      />
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
