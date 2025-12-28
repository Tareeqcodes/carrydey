import ProgressSidebar from './steps/ProgressSidebar';

const OnboardingLayout = ({ children, currentStep }) => {
  return (
    <div className="min-h-screen mt-24 ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <ProgressSidebar currentStep={currentStep} />
          <div className="lg:col-span-8 xl:col-span-9">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
