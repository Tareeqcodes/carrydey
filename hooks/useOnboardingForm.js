'use client';
import { useState } from 'react';
import { tablesDB, ID, storage } from '@/lib/config/Appwriteconfig';
import { useAuth } from './Authcontext';

const useOnboardingForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    yearEstablished: '',
    website: '',
    contactPerson: '',
    email: '',

    street: '',
    city: '',
    state: '',
    postalCode: '',
    businessType: '',
    vehicleTypes: [],
    services: [],
    registrationCertificate: null,
    taxCertificate: null,
    ownerNiN: null,
    phone: '',
    alternatePhone: '',
    termsAccepted: false,
    privacyPolicyAccepted: false,
    dataProcessingAgreement: false,
    marketingEmails: false,
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

  const handleFileUpload = (documentType, file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        [documentType]: file,
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]+$/;

    switch (step) {
      case 1:
        if (!formData.organizationName.trim())
          newErrors.organizationName = 'Organization name is required';
        if (!formData.organizationType)
          newErrors.organizationType = 'Please select organization type';
        if (
          !formData.yearEstablished ||
          formData.yearEstablished < 1900 ||
          formData.yearEstablished > new Date().getFullYear()
        ) {
          newErrors.yearEstablished = 'Please enter a valid year';
        }
        break;
      case 2:
        if (!formData.contactPerson.trim())
          newErrors.contactPerson = 'Contact person name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email))
          newErrors.email = 'Please enter a valid email';
        if (!formData.phone.trim())
          newErrors.phone = 'Phone number is required';
        else if (!phoneRegex.test(formData.phone.replace(/\s/g, '')))
          newErrors.phone = 'Please enter a valid phone number';
        break;
      case 3:
        if (!formData.street.trim())
          newErrors['street'] = 'Street address is required';
        if (!formData.city.trim()) newErrors['city'] = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        break;
      case 4:
        if (!formData.businessType)
          newErrors.businessType = 'Please select business type';
        if (!formData.vehicleTypes || formData.vehicleTypes.length === 0) {
          newErrors.vehicleTypes = 'Please select at least one vehicle type';
        }
        if (formData.services.length === 0)
          newErrors.services = 'Please select at least one service';
        break;
      case 5:
        if (!formData.registrationCertificate)
          newErrors.registrationCertificate =
            'Registration certificate is required';
        if (!formData.taxCertificate)
          newErrors.taxCertificate = 'Tax certificate is required';
        break;
      case 6:
        if (!formData.termsAccepted)
          newErrors.termsAccepted = 'You must accept the Terms of Service';
        if (!formData.privacyPolicyAccepted)
          newErrors.privacyPolicyAccepted =
            'You must accept the Privacy Policy';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Upload file to Appwrite Storage
  const uploadFile = async (file, bucketId) => {
    try {
      const response = await storage.createFile({
        bucketId: bucketId,
        fileId: ID.unique(),
        file,
      });
      return response.$id;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const submitToAppwrite = async () => {
    setIsSubmitting(true);
    try {
      let registrationCertificateId = null;
      let taxCertificateId = null;
      let ownerNiN = null;
      
      const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_LISENCE_BUCKET_ID;
      if (formData.registrationCertificate) {
        registrationCertificateId = await uploadFile(
          formData.registrationCertificate,
          BUCKET_ID
        );
      }

      if (formData.taxCertificate) {
        taxCertificateId = await uploadFile(formData.taxCertificate, BUCKET_ID);
      }
      if (formData.ownerNiN) {
        ownerNiN = await uploadFile(formData.ownerNiN, BUCKET_ID);
      }


      // Prepare data for Appwrite
      const organizationData = {
        name: formData.organizationName,
        type: formData.organizationType,
        yearEstablished: parseInt(formData.yearEstablished),
        website: formData.website || null,
        contactPerson: formData.contactPerson,
        email: formData.email,

        address: formData.street,
        city: formData.city || null,
        state: formData.state,
        businessType: formData.businessType,
        vehicleTypes:
          formData.vehicleTypes.length > 0
            ? JSON.stringify(formData.vehicleTypes)
            : null,
        services:
          formData.services.length > 0
            ? JSON.stringify(formData.services)
            : null,
        registrationCertificate: registrationCertificateId,
        taxCertificate: taxCertificateId,
        verificationNotes: null,
        ownerNiN: ownerNiN,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        userId: user.$id,
        rating: null,
        minPrice: null,
        status: true,
        verified: false,

      };

      // Create document in Appwrite
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
    handleFileUpload,
    validateStep,
    submitToAppwrite,
  };
};

export default useOnboardingForm;
