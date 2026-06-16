import React, { useState } from "react";
import { X, SendHorizontal, Loader2 } from "lucide-react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/leave", formData);

      toast.success("Leave applied successfully");

      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to apply leave"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Apply Leave
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Submit a leave request
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Leave Type */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Leave Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="ANNUAL">Annual Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 text-sm font-medium">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

          </div>

          {/* Reason */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Reason
            </label>

            <textarea
              rows="4"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain why you need leave..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <SendHorizontal size={18} />
                  Apply Leave
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal; 