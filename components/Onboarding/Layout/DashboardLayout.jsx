import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

const DashboardLayout = ({ children, activePage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      
      <div className="flex">
        <Sidebar activePage={activePage} onPageChange={onPageChange} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <BottomNav activePage={activePage} onPageChange={onPageChange} />
      <div className="lg:hidden pb-16"></div>
    </div>
  );
};

export default DashboardLayout;