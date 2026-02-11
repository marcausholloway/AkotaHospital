
import React, { useState } from 'react';
import { Doctor } from '../types';

interface BookingModalProps {
  doctor: Doctor;
  onClose: () => void;
  onConfirm: (bookingDetails: { date: string; time: string; name: string; contact: string }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: doctor.availability[0] || '10:00 AM',
    name: '',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-black">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-bold text-black">Book Appointment with {doctor.name}</h2>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-bold text-black">Select Date:</label>
            <div className="w-2/3 relative">
              <input 
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-bold text-black">Select Time:</label>
            <select 
              value={formData.time}
              onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-2/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
            >
              {doctor.availability.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-bold text-black">Your Name:</label>
            <input 
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-2/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
              required
            />
          </div>
          
          <div className="flex items-center gap-4">
            <label className="w-1/3 text-sm font-bold text-black">Contact Number:</label>
            <input 
              type="tel"
              placeholder="Enter your number"
              value={formData.contact}
              onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              className="w-2/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black bg-white"
              required
            />
          </div>
          
          <div className="pt-2 flex justify-center">
            <button 
              type="submit"
              className="w-full bg-[#1e6db2] text-white py-2.5 rounded font-black hover:bg-blue-700 transition-colors shadow-md"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
