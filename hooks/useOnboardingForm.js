'use client';
import { useState } from 'react';
import { tablesDB, ID } from '@/lib/config/Appwriteconfig';
import { useAuth } from './Authcontext';

const useOnboardingForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    street: '',
    vehicleTypes: [],
    services: [],
    // registrationCertificate: null,
    // taxCertificate: null,
    // ownerNiN: null,
    phone: '',
    alternatePhone: '',
    serviceCities: '',
    isAvailable: true,
    termsAccepted: false,
    privacyPolicyAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  // const handleFileUpload = (documentType, file) => {
  //   if (file && file.size <= 5 * 1024 * 1024) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [documentType]: file,
  //     }));
  //   }
  // };
const validateStep = (step) => {
  const newErrors = {};
  const phoneRegex = /^[+]?[\d\s\-()]+$/;

  switch (step) { 
    case 1: 
      if (!formData.organizationName.trim())
        newErrors.organizationName = 'Organization name is required';
      if (!formData.organizationType.trim())
        newErrors.organizationType = 'Organization type is required';
      if (!formData.phone.trim())
        newErrors.phone = 'Phone number is required';
      else if (!phoneRegex.test(formData.phone.replace(/\s/g, '')))
        newErrors.phone = 'Please enter a valid phone number';
      break;
      
    case 2:
      if (!formData.street.trim())
        newErrors.street = 'Street address is required';
      break;
      
    case 3:
      if (!formData.serviceCities || formData.serviceCities.trim().length === 0)
        newErrors.serviceCities = 'Please enter at least one service city';
      break;
      
    case 4:
      if (!formData.vehicleTypes || formData.vehicleTypes.length === 0) {
        newErrors.vehicleTypes = 'Please select at least one vehicle type';
      }
      if (formData.services.length === 0)
        newErrors.services = 'Please select at least one service';
      break;
    
    case 5:
      if (!formData.termsAccepted)
        newErrors.termsAccepted = 'You must accept the Terms of Service';
      if (!formData.privacyPolicyAccepted)
        newErrors.privacyPolicyAccepted = 'You must accept the Privacy Policy';
      break;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // const uploadFile = async (file, bucketId) => {
  //   try {
  //     const response = await storage.createFile({
  //       bucketId: bucketId,
  //       fileId: ID.unique(),
  //       file,
  //     });
  //     return response.$id;
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw error;
  //   }
  // };

  const submitToAppwrite = async () => {
    setIsSubmitting(true);
    try {
      // let registrationCertificateId = null;
      // let taxCertificateId = null;
      // let ownerNiN = null;

      // const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_LISENCE_BUCKET_ID;
      // if (formData.registrationCertificate) {
      //   registrationCertificateId = await uploadFile(
      //     formData.registrationCertificate,
      //     BUCKET_ID
      //   );
      // }

      // if (formData.taxCertificate) {
      //   taxCertificateId = await uploadFile(formData.taxCertificate, BUCKET_ID);
      // }
      // if (formData.ownerNiN) {
      //   ownerNiN = await uploadFile(formData.ownerNiN, BUCKET_ID);
      // }

      const organizationData = {
        name: formData.organizationName,
        type: formData.organizationType,
        address: formData.street,
        vehicleTypes:
          formData.vehicleTypes.length > 0
            ? JSON.stringify(formData.vehicleTypes)
            : null,
        services:
          formData.services.length > 0
            ? JSON.stringify(formData.services)
            : null,
        // registrationCertificate: registrationCertificateId,
        // taxCertificate: taxCertificateId,
        // ownerNiN: ownerNiN,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        userId: user.$id,
        rating: null,
        minPrice: null,
        status: true, 
        verified: false,
         serviceCities: formData.serviceCities || null, 
            isAvailable: true,
      };

      const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const cll = process.env.NEXT_PUBLIC_APPWRITE_ORGANISATION_COLLECTION_ID;

      const response = await tablesDB.createRow({
        databaseId: db,
        tableId: cll,
        rowId: ID.unique(),
        data: organizationData,
      });

      setIsSubmitting(false);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error submitting to Appwrite:', error);
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleInputChange,
    handleServiceToggle,
    // handleFileUpload,
    validateStep,
    submitToAppwrite,
  };
};

export default useOnboardingForm;
