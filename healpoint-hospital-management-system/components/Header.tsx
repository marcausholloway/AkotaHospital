
import React from 'react';
import { View, AppSettings } from '../types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  settings: AppSettings;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, settings }) => {
  return (
    <header className="bg-[#1e6db2] text-white px-8 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('doctors')}>
        <i className={`fa-solid ${settings.appIcon} text-2xl`}></i>
        <h1 className="text-xl font-bold">{settings.appName}</h1>
      </div>
      
      <nav className="flex items-center gap-8 font-medium">
        <button 
          onClick={() => onViewChange('doctors')}
          className={`hover:opacity-80 transition-opacity ${currentView === 'doctors' ? 'border-b-2 border-white' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => onViewChange('doctors')}
          className={`hover:opacity-80 transition-opacity ${currentView === 'doctors' ? 'border-b-2 border-white' : ''}`}
        >
          Doctors
        </button>
        <button 
          onClick={() => onViewChange('appointments')}
          className={`hover:opacity-80 transition-opacity ${currentView === 'appointments' ? 'border-b-2 border-white' : ''}`}
        >
          Appointments
        </button>
        <button 
          onClick={() => onViewChange('profile')}
          className={`hover:opacity-80 transition-opacity ${currentView === 'profile' ? 'border-b-2 border-white' : ''}`}
        >
          My Profile
        </button>
        <button 
          onClick={() => onViewChange('admin')}
          className={`hover:opacity-80 transition-opacity ${currentView === 'admin' ? 'border-b-2 border-white' : ''}`}
        >
          Admin Panel
        </button>
        <button className="border border-white px-4 py-1 rounded hover:bg-white hover:text-[#1e6db2] transition-all">
          Logout
        </button>
      </nav>
    </header>
  );
};
