import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  // Mock user data - in a real app, this would come from your auth context or API
  const [user, setUser] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: '2023-01-15',
    is2FAEnabled: false,
  });

  const [is2FASetup, setIs2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm({
    defaultValues: {
      fullName: user.fullName,
    },
  });

  // Password form
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch, formState: { errors: passwordErrors } } = useForm();

  // 2FA form
  const { register: register2FA, handleSubmit: handle2FASubmit, reset: reset2FA } = useForm();

  // Watch password fields for validation
  const newPassword = watch('newPassword');

  // Handle profile update
  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...user, fullName: data.fullName });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call to /api/auth/change-password
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetPassword();
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle 2FA
  const toggle2FA = async () => {
    if (user.is2FAEnabled) {
      // Disabling 2FA
      setIsLoading(true);
      try {
        // Simulate API call to /api/auth/disable-2fa
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({ ...user, is2FAEnabled: false });
        setIs2FASetup(false);
        toast.success('2FA disabled successfully');
      } catch (error) {
        toast.error('Failed to disable 2FA');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enabling 2FA - first step is setup
      setIs2FASetup(true);
      // Simulate getting QR code and secret from /api/auth/setup-2fa
      setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/VaultGuard:john.doe@example.com?secret=JBSWY3DPEHPK3PXP&issuer=VaultGuard');
      setSecretKey('JBSWY3DPEHPK3PXP');
    }
  };

  // Verify 2FA setup
  const on2FASubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call to /api/auth/enable-2fa with the verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...user, is2FAEnabled: true });
      setIs2FASetup(false);
      reset2FA();
      toast.success('2FA enabled successfully');
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel 2FA setup
  const cancel2FASetup = () => {
    setIs2FASetup(false);
    setQrCodeUrl('');
    setSecretKey('');
  };

  // Reset forms when user changes
  useEffect(() => {
    resetProfile({ fullName: user.fullName });
  }, [user, resetProfile]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              {...registerProfile('fullName', { required: 'Full name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
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
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
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
            {newPassword && !passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-green-600">Password strength: Strong</p>
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

      {/* Two-Factor Authentication Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              {user.is2FAEnabled
                ? '2FA is currently enabled for your account'
                : 'Add an extra layer of security to your account'}
            </p>
          </div>
          <button
            onClick={toggle2FA}
            disabled={isLoading || is2FASetup}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${user.is2FAEnabled ? 'bg-green-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {is2FASetup && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium mb-3">Set Up Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-4">
              Scan the QR code below with your authenticator app or enter the secret key manually.
            </p>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 mb-2 border border-gray-300" />
                )}
                <p className="text-xs text-gray-500">Scan with Google Authenticator</p>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={secretKey}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(secretKey);
                        toast.info('Secret key copied to clipboard');
                      }}
                      className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <form onSubmit={handle2FASubmit(on2FASubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter 6-digit code from your authenticator app
                    </label>
                    <input
                      type="text"
                      {...register2FA('code', {
                        required: 'Verification code is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'Code must be 6 digits',
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Verifying...' : 'Verify and Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={cancel2FASetup}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;