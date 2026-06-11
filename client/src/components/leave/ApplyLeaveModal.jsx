import React, { useState } from 'react';
import { X, SendHorizontal, Loader2, AlertCircle } from 'lucide-react';

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    numberOfDays: '',
    startDate: '',
    endDate: '',
    priority: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', icon: '🤒' },
    { value: 'casual', label: 'Casual Leave', icon: '⛱️' },
    { value: 'annual', label: 'Annual Leave', icon: '🌴' },
    { value: 'emergency', label: 'Emergency Leave', icon: '🚨' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-calculate days when start/end date changes
    if (name === 'startDate' || name === 'endDate') {
      if (formData.startDate && (name === 'endDate' ? value : formData.endDate)) {
        const start = new Date(name === 'startDate' ? value : formData.startDate);
        const end = new Date(name === 'endDate' ? value : formData.endDate);
        if (start && end && end >= start) {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          setFormData(prev => ({ ...prev, numberOfDays: diffDays.toString() }));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leaveType) newErrors.leaveType = 'Please select leave type';
    if (!formData.numberOfDays || formData.numberOfDays < 1) newErrors.numberOfDays = 'Please enter valid number of days';
    if (!formData.startDate) newErrors.startDate = 'Please select start date';
    if (!formData.endDate) newErrors.endDate = 'Please select end date';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.priority) newErrors.priority = 'Please select priority';
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason for leave';
    if (formData.reason.trim().length < 10) newErrors.reason = 'Please provide at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess && onSuccess(formData);
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setFormData({
      leaveType: '',
      numberOfDays: '',
      startDate: '',
      endDate: '',
      priority: '',
      reason: ''
    });
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Apply Leave</h2>
            <p className="text-slate-500 text-sm mt-1">Submit a leave request for approval</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
            aria-label="Close modal"
          >
            <X size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Leave Type */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-slate-700 font-medium text-sm">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition-all
                  ${errors.leaveType 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/50' 
                    : 'border-slate-200 focus:ring-2 focus:ring-purple-500'}
                `}
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {errors.leaveType && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.leaveType}
                </p>
              )}
            </div>

           

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium text-sm">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={minDate}
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition-all
                  ${errors.startDate 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/50' 
                    : 'border-slate-200 focus:ring-2 focus:ring-purple-500'}
                `}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium text-sm">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || minDate}
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition-all
                  ${errors.endDate 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/50' 
                    : 'border-slate-200 focus:ring-2 focus:ring-purple-500'}
                `}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.endDate}
                </p>
              )}
            </div>

            

            {/* Empty div for grid alignment */}
            <div className="hidden md:block" />

            {/* Reason - Full Width */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-slate-700 font-medium text-sm">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explain why you need leave..."
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition-all resize-none
                  ${errors.reason 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/50' 
                    : 'border-slate-200 focus:ring-2 focus:ring-purple-500'}
                `}
              />
              {errors.reason && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.reason}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md
                hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center gap-2
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <SendHorizontal size={18} />
                  <span>Apply Leave</span>
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