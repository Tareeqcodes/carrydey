'use client';
import { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Truck,
  Loader2,
  Smartphone,
  PhoneCall,
  Trash2,
} from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  phone: '',
  phoneType: 'android',
  vehicleType: '',
  status: 'available',
  assignedDelivery: false,
};

const vehicleTypes = [
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
];

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'offline', label: 'Offline' },
  { value: 'on_delivery', label: 'On Delivery' },
];

const phoneTypeOptions = [
  {
    value: 'android',
    label: 'Android',
    icon: Smartphone,
  },
  {
    value: 'keypad',
    label: 'Keypad',
    icon: PhoneCall,
  },
];

const AddDriverModal = ({
  isOpen,
  onClose,
  onAddDriver,
  onDeleteDriver, 
  driverToEdit,
}) => {
  const isEditMode = Boolean(driverToEdit);
  const isOnDelivery = driverToEdit?.status === 'on_delivery';

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (driverToEdit) {
        setFormData({
          name: driverToEdit.name || '',
          phone: driverToEdit.phone || '',
          vehicleType: driverToEdit.vehicleType || '',
          status: driverToEdit.status || 'available',
          assignedDelivery: driverToEdit.assignedDelivery || false,
          phoneType: driverToEdit.phoneType || 'android',
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, driverToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Driver name is required';
    else if (formData.name.length > 200)
      newErrors.name = 'Name must be less than 200 characters';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.length > 50)
      newErrors.phone = 'Phone must be less than 50 characters';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const result = await onAddDriver(formData);
      if (result?.success) {
        setFormData(EMPTY_FORM);
        setErrors({});
        onClose();
      } else {
        setErrors({
          submit:
            result?.error ||
            `Failed to ${isEditMode ? 'update' : 'add'} driver.`,
        });
      }
    } catch {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!driverToEdit?.$id) return;
    setIsDeleting(true);
    try {
      const result = await onDeleteDriver(driverToEdit.$id);
      if (!result?.success) {
        setErrors({ submit: result?.error || 'Failed to delete driver.' });
        setShowDeleteConfirm(false);
      }
      // on success, TrackAgencyDelivery calls onClose for us
    } catch {
      setErrors({ submit: 'An unexpected error occurred.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isDeleting) {
      setFormData(EMPTY_FORM);
      setErrors({});
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2
            className="text-lg font-black text-gray-900"
            style={{ letterSpacing: '-0.3px' }}
          >
            {isEditMode ? driverToEdit.name : 'Add New Driver'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Driver Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Driver Name 
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Emeka Okafor"
                maxLength={200}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-[#3A0A21] focus:border-[#3A0A21]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g., 0803 456 7890"
                maxLength={50}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-[#3A0A21] focus:border-[#3A0A21]'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Phone Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Phone Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {phoneTypeOptions.map(
                ({ value, label, icon: Icon }) => {
                  const isSelected = formData.phoneType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange('phoneType', value)}
                      disabled={isSubmitting}
                      className={`flex items-center  gap-3 p-3 border rounded-xl text-left transition-all disabled:opacity-50 ${
                        isSelected
                          ? 'border-[#3A0A21] bg-[#3A0A21] bg-opacity-5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3A0A21]' : 'bg-[#3A0A21]'}`}
                      >
                        <Icon
                          className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}
                        >
                          {label}
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Vehicle Type
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.vehicleType}
                onChange={(e) => handleChange('vehicleType', e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3A0A21] focus:border-[#3A0A21] transition-colors appearance-none bg-white"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Status (add mode only) */}
          {!isEditMode && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Initial Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-colors appearance-none bg-white ${
                  errors.status
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-[#3A0A21] focus:border-[#3A0A21]'
                }`}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-600">{errors.status}</p>
              )}
            </div>
          )}

          {/* Delete section — edit mode only */}
          {isEditMode && onDeleteDriver && (
            <div className="pt-1">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting || isDeleting || isOnDelivery}
                  className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Driver
                </button>
              ) : (
                <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Delete this driver?
                  </p>
                  <p className="text-xs text-red-600 mb-3">
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              )}
              {isOnDelivery && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Cannot delete — driver has an active delivery
                </p>
              )}
            </div>
          )}

          {/* Submit error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || isDeleting}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isDeleting}
              className="flex-1 px-4 py-2.5 text-white rounded-xl transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
              style={{
                background: '#3A0A21',
                boxShadow: '0 2px 8px rgba(58,10,33,0.25)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Saving...' : 'Adding...'}
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Add Driver'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDriverModal;
