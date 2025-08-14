/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  message: string;
  data?: any;
}

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengubah password');
      }

      const result = await response.json();
      setSuccess('Password berhasil diubah');
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Gagal mengubah password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
    clearMessages
  };
};