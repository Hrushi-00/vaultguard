import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    createdAt: '',
    is2FAEnabled: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm();

  // Password form
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    reset: resetPassword, 
    watch, 
    formState: { errors: passwordErrors } 
  } = useForm();

  // Watch password fields for validation
  const newPassword = watch('newPassword');

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://vaultguard-backend-1.onrender.com/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.success && response.data.user) {
        setUser({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          createdAt: response.data.user.createdAt,
          is2FAEnabled: response.data.user.is2FAEnabled || false
        });
        
        resetProfile({ fullName: response.data.user.fullName });
      } else {
        toast.error('Failed to fetch profile data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    }
  };

  // Handle profile update
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://vaultguard-backend-1.onrender.com/api/auth/profile', 
        { fullName: data.fullName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUser({ ...user, fullName: data.fullName });
        resetProfile({ fullName: data.fullName });
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://vaultguard-backend-1.onrender.com/api/auth/change-password',
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        resetPassword();
        toast.success('Password changed successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              {...registerProfile('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {profileErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">{profileErrors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
            <input
              type="text"
              value={new Date(user.createdAt).toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              {...registerPassword('currentPassword', { 
                required: 'Current password is required' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              {...registerPassword('newPassword', {
                required: 'New password is required',
                minLength: { 
                  value: 8, 
                  message: 'Password must be at least 8 characters' 
                },
                validate: (value) => {
                  return (
                    [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                      pattern.test(value)
                    ) || 'Password must include uppercase, lowercase, number, and symbol'
                  );
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              {...registerPassword('confirmPassword', {
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;