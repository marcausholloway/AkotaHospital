
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
}

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'doctors', label: 'Doctors List', icon: 'fa-user-md' },
    { id: 'appointments', label: 'My Appointments', icon: 'fa-calendar-check' },
    { id: 'records', label: 'Medical Records', icon: 'fa-file-medical' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col p-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`w-full text-left px-4 py-3 rounded-sm flex items-center gap-3 transition-colors ${
              currentView === item.id 
              ? 'bg-[#1e6db2] text-white' 
              : 'text-black hover:bg-gray-100'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
