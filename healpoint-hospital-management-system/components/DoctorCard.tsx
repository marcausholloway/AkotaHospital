
import React from 'react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow text-black">
      <div className="p-4 flex gap-4">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-24 h-24 rounded-sm object-cover border border-gray-200"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-[#1e6db2] font-bold text-lg cursor-pointer hover:underline">{doctor.name}</h3>
          <p className="text-black font-medium text-sm">{doctor.specialty}</p>
        </div>
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 flex-grow">
        <div className="flex items-start gap-2 text-sm">
          <span className="font-bold text-black whitespace-nowrap">Next Available:</span>
          <div className="flex flex-wrap gap-2">
            {doctor.availability.map((time, idx) => (
              <span key={idx} className="flex items-center gap-1 text-black font-medium">
                <i className="fa-regular fa-clock text-xs"></i>
                {time}{idx < doctor.availability.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0">
        <button 
          onClick={() => onBook(doctor)}
          className="w-full bg-[#1e6db2] text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};
