'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, User, UserPlus } from 'lucide-react';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import AddUserModal from '@/components/AddUserModal';
import Toast from '@/components/Toast';

export default function AdminChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdateProfile = () => {
    setShowDropdown(false);
    setShowProfileModal(true);
  };

  const handleAddUser = () => {
    setShowDropdown(false);
    setShowAddUserModal(true);
  };

  const handleAddUserSuccess = () => {
    setShowAddUserModal(false);
    setToastMessage('User created successfully!');
    setShowToast(true);
  };

  return (
    <div className="relative">
      {/* Settings Dropdown */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg transition-all"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Settings</span>
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 min-w-[140px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={handleUpdateProfile}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 whitespace-nowrap"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Update</span>
            </button>
            <button
              onClick={handleAddUser}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 border-t border-gray-200 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Add User</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 border-t border-gray-200 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <UpdateProfileModal
          onClose={() => setShowProfileModal(false)}
          onSuccess={handleLogout}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      {children}
    </div>
  );
}

