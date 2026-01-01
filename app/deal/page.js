'use client';
import { useState } from 'react';
import { User, Briefcase, ArrowRight, Check, Package, MapPin, Wallet } from 'lucide-react';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    idNumber: '',
    organizationName: '',
    businessType: '',
    registrationNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const handleRoleSelect = (role) => {
    setIsAnimating(true);
    setTimeout(() => {
      setUserRole(role);
      setCurrentStep(1);
      setIsAnimating(false);
    }, 400);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep === 1) {
        setCurrentStep(0);
        setUserRole(null);
      } else {
        setCurrentStep(prev => prev - 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = () => {
    setIsAnimating(true);
    setTimeout(() => {
      console.log('Submitted:', { userRole, ...formData });
      setCurrentStep(5);
      setIsAnimating(false);
    }, 300);
  };

  // Role Selection
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className={`w-full max-w-6xl transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <Package className="w-8 h-8" />
              <span className="text-2xl font-light tracking-wider">CARRYDEY</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-light mb-6 tracking-tight">
              Join as a Traveler
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Turn your journey into earnings
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => handleRoleSelect('individual')}
              className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-12 hover:bg-white/10 transition-all duration-500 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500"></div>
              
              <div className="relative z-10">
                <User className="w-12 h-12 mb-8 text-blue-400" strokeWidth={1.5} />
                
                <h3 className="text-3xl font-light mb-4">Individual</h3>
                <p className="text-gray-400 font-light mb-8">
                  For solo travelers looking to earn extra income while traveling
                </p>
                
                <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                  <span className="font-light">Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('organization')}
              className="group relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-12 hover:bg-white/10 transition-all duration-500 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500"></div>
              
              <div className="relative z-10">
                <Briefcase className="w-12 h-12 mb-8 text-purple-400" strokeWidth={1.5} />
                
                <h3 className="text-3xl font-light mb-4">Organization</h3>
                <p className="text-gray-400 font-light mb-8">
                  For logistics companies and delivery agencies seeking flexible capacity
                </p>
                
                <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                  <span className="font-light">Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-green-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-light mb-4 tracking-tight">Welcome aboard</h1>
          <p className="text-xl text-gray-400 font-light mb-12">
            Your {userRole} traveler profile is ready
          </p>
          <button className="px-8 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-light">
            Start earning
          </button>
        </div>
      </div>
    );
  }

  // Form Steps
  const steps = userRole === 'individual' 
    ? ['Personal Info', 'Travel Details', 'Payment Info', 'Verification']
    : ['Business Info', 'Fleet Details', 'Payment Info', 'Verification'];

  const currentStepIndex = currentStep - 1;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors font-light text-sm"
            >
              ← Back
            </button>
            <div className="text-sm font-light text-gray-500">
              {currentStep} of {steps.length}
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  idx < currentStep ? 'bg-white' : 'bg-white/10'
                }`}
              ></div>
            ))}
          </div>
          
          <h2 className="text-4xl font-light tracking-tight">{steps[currentStepIndex]}</h2>
        </div>

        {/* Form Content */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {currentStep === 1 && userRole === 'individual' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && userRole === 'organization' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="Your Company Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Business Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                >
                  <option value="">Select type</option>
                  <option value="logistics">Logistics Company</option>
                  <option value="courier">Courier Service</option>
                  <option value="delivery">Delivery Agency</option>
                  <option value="transport">Transport Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="RC000000"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">
                  {userRole === 'individual' ? 'Vehicle Type' : 'Fleet Size'}
                </label>
                {userRole === 'individual' ? (
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  >
                    <option value="">Select vehicle</option>
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                    placeholder="Number of vehicles"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">
                  {userRole === 'individual' ? 'Vehicle Number' : 'Operating Cities'}
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder={userRole === 'individual' ? 'ABC 123 XY' : 'Lagos, Abuja, Port Harcourt'}
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Primary Route/Area</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="Lagos - Abuja"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Bank Name</label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                >
                  <option value="">Select bank</option>
                  <option value="gtb">GTBank</option>
                  <option value="access">Access Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="firstbank">First Bank</option>
                  <option value="uba">UBA</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="0000000000"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-400 mb-2">
                  {userRole === 'individual' ? "Driver's License / ID Number" : 'Business Registration Document'}
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-white/30 transition-colors font-light"
                  placeholder={userRole === 'individual' ? 'ABC12345678' : 'Upload document'}
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
                <p className="text-sm font-light text-gray-400 mb-4">
                  Upload verification documents
                </p>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-light text-sm">
                  Choose files
                </button>
              </div>
              <p className="text-xs font-light text-gray-500">
                All information is encrypted and securely stored
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={handleBack}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors font-light"
            >
              Back
            </button>
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-light"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-light"
              >
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;