import { useState, useCallback } from 'react';
import { verificationData as verificationService } from '../utils/verificationData';
import { useAuth } from '../hooks/Authcontext';

export const useVerification = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationData, setVerificationData] = useState({
    userId: user?.$id,
    licenseFileId: null,
    licenseUrl: null,
    nin: '',
    termsAccepted: false,
    status: 'pending',
    submittedAt: null
  });

  const uploadLicense = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);

    const result = await verificationService.uploadLicense(file);
    
    if (result.success) {
      setVerificationData(prev => ({
        ...prev,
        licenseFileId: result.fileId,
        licenseUrl: result.fileUrl
      }));
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, []);

  const updateNIN = useCallback((nin) => {
    const cleanNin = nin.replace(/\D/g, '').slice(0, 11);
    setVerificationData(prev => ({
      ...prev,
      nin: cleanNin
    }));
    return cleanNin.length === 11;
  }, []);

  const acceptTerms = useCallback((accepted) => {
    setVerificationData(prev => ({
      ...prev,
      termsAccepted: accepted
    }));
  }, []);

  const submitVerification = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    const submissionData = {
      ...verificationData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    const result = await verificationService.createVerification(submissionData);
    
    if (result.success) {
      setVerificationData(prev => ({
        ...prev,
        verificationId: result.verificationId,
        submittedAt: submissionData.submittedAt
      }));
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, [user, verificationData]);

  const resetVerification = useCallback(() => {
    setVerificationData({
      userId: user?.$id,
      licenseFileId: null,
      licenseUrl: null,
      nin: '',
      termsAccepted: false,
      status: 'pending',
      submittedAt: null
    });
    setError(null);
  }, [user]);

  return {
    verificationData,
    isLoading,
    error,
    uploadLicense,
    updateNIN,
    acceptTerms,
    submitVerification,
    resetVerification
  };
};