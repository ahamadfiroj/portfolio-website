'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface UpdateProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  mobile?: string;
  role: string;
}

export default function UpdateProfileModal({ onClose, onSuccess }: UpdateProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/admin/me');
        const data = await response.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setFormData({
            fullName: data.user.fullName || '',
            username: data.user.username || '',
            email: data.user.email || '',
            mobile: data.user.mobile || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } catch {
        setError('Failed to load user data');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.username || !formData.email) {
      setError('Name, username, and email are required');
      return;
    }

    // If changing password, validate
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
    }

    if (!currentUser) {
      setError('User data not loaded');
      return;
    }

    setIsLoading(true);

    try {
      // First, verify current password if changing password
      if (formData.newPassword) {
        const loginResponse = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            password: formData.currentPassword,
          }),
        });

        if (!loginResponse.ok) {
          setError('Current password is incorrect');
          setIsLoading(false);
          return;
        }
      }

      // Prepare updates
      const updates: {
        fullName: string;
        email: string;
        mobile?: string;
        password?: string;
      } = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile || undefined,
      };

      // Only add password to updates if provided
      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      // Update profile
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          updates,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully! Logging out...');
        setTimeout(() => {
          onSuccess(); // This will logout the user
        }, 2000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up md:animate-none">
        {/* Mobile drag handle */}
        <div
          className="md:hidden flex justify-center py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={onClose}
        >
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Update Profile</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start gap-2 md:gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2 md:gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoadingUser ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Personal Information */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                      title="Username cannot be changed"
                    />
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      Mobile Number <span className="text-gray-400 text-[10px] md:text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 border-b pb-2">
                  Change Password <span className="text-gray-400 text-xs md:text-sm font-normal">(Optional)</span>
                </h3>

                {/* Current Password */}
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="w-full px-3 md:px-4 py-2 pr-10 md:pr-12 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full px-3 md:px-4 py-2 pr-10 md:pr-12 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full px-3 md:px-4 py-2 pr-10 md:pr-12 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] md:text-xs text-gray-500">
                  Leave password fields empty if you don&apos;t want to change your password
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

