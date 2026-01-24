'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { usePasswordRequirements, changePassword } from '@/hooks/usePasswordCheck';

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { requirements, isLoading: loadingRequirements } = usePasswordRequirements();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordForm>({
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const newPassword = watch('new_password');

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      const response = await changePassword(data);
      
      if (response.success) {
        toast.success('Password changed successfully! Redirecting to dashboard...');
        reset(); // Clear form
        // Small delay to let user see the success message
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Refresh to update proxy state
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            For security reasons, you must change your password before accessing the dashboard.
            This is required for imported teacher accounts.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Controller
                name="current_password"
                control={control}
                rules={{
                  required: 'Current password is required',
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Enter your current password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.current_password ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  />
                )}
              />
              {errors.current_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Controller
                name="new_password"
                control={control}
                rules={{
                  required: 'New password is required',
                  minLength: {
                    value: requirements?.min_length || 8,
                    message: `Password must be at least ${requirements?.min_length || 8} characters`,
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Enter your new password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.new_password ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  />
                )}
              />
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Controller
                name="new_password_confirmation"
                control={control}
                rules={{
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Confirm your new password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                  />
                )}
              />
              {errors.new_password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.new_password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          {!loadingRequirements && requirements && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Password Requirements
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Minimum {requirements.min_length} characters</li>
                      {requirements.requires_confirmation && (
                        <li>Password confirmation required</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || !isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact your system administrator.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}