'use client';
import { useState } from 'react';
import { tableDb, ID, storage } from '@/lib/config/Appwriteconfig';

const useOnboardingForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    yearEstablished: '',
    website: '', 
    contactPerson: '',
    email: '',
    phone: '',
    alternatePhone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
    businessType: 'private',
    vehicleTypes: [],
    serviceAreas: [],
    services: [],
      registrationCertificate: null,
      taxCertificate: null,
      ownerId: null,
    termsAccepted: false,
    privacyPolicyAccepted: false,
    dataProcessingAgreement: false,
    marketingEmails: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        documents: {
          ...prev.documents,
          [documentType]: file,
        },
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
        if (!formData.registrationNumber.trim())
          newErrors.registrationNumber = 'Registration number is required';
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
        if (!formData.address.street.trim())
          newErrors['address.street'] = 'Street address is required';
        if (!formData.address.city.trim())
          newErrors['address.city'] = 'City is required';
        if (!formData.address.state.trim())
          newErrors['address.state'] = 'State is required';
        if (!formData.address.postalCode.trim())
          newErrors['address.postalCode'] = 'Postal code is required';
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
        if (!formData.documents.registrationCertificate)
          newErrors.registrationCertificate =
            'Registration certificate is required';
        if (!formData.documents.taxCertificate)
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
      const fileId = ID.unique();
      const response = await storage.createFile(bucketId, fileId, file);
      return response.$id;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Submit form data to Appwrite
  const submitToAppwrite = async (userId) => {
    setIsSubmitting(true);
    try {
      // Upload documents first (if storage is configured)
      let registrationCertificateId = null;
      let taxCertificateId = null;
      let insuranceCertificateId = null;

      const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_LISENCE_BUCKET_ID; 

      if (formData.documents.registrationCertificate) {
        registrationCertificateId = await uploadFile(
          formData.documents.registrationCertificate,
          BUCKET_ID
        );
      }

      if (formData.documents.taxCertificate) {
        taxCertificateId = await uploadFile(
          formData.documents.taxCertificate,
          BUCKET_ID
        );
      }

      // Prepare data for Appwrite
      const organizationData = {
        name: formData.organizationName,
        type: formData.organizationType,
        registrationNumber: formData.registrationNumber,
        yearEstablished: parseInt(formData.yearEstablished),
        website: formData.website || null,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: parseInt(formData.phone.replace(/\D/g, '')), // Remove non-digits
        alternatePhone: formData.alternatePhone
          ? parseInt(formData.alternatePhone.replace(/\D/g, ''))
          : null,
        address: formData.address.street,
        city: formData.address.city || null,
        state: formData.address.state,
        postalCode: formData.address.postalCode
          ? parseInt(formData.address.postalCode)
          : null,
        businessType: formData.businessType,
        employeeCount: null, // Add if you collect this
        fleetSize: null, // Add if you collect this
        serviceAreas: formData.serviceAreas.length > 0 
          ? JSON.stringify(formData.serviceAreas) 
          : null,
        services: formData.services.length > 0 
          ? JSON.stringify(formData.services) 
          : null,
        registrationCertificate: registrationCertificateId,
        taxCertificate: taxCertificateId,
        insuranceCertificate: insuranceCertificateId,
        ownerId: userId,
        verificationStatus: 'pending',
        verificationNotes: null,
        status: true,
      };

      // Create document in Appwrite
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID; 
      const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID; 

      const response = await tableDb.createDocument({
        database: DATABASE_ID,
        collection: COLLECTION_ID,
        documentId: ID.unique(),
        data: organizationData
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