
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DoctorCard } from './components/DoctorCard';
import { BookingModal } from './components/BookingModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { AIChatbot } from './components/AIChatbot';
import { View, Doctor, Appointment, Specialty, AppSettings } from './types';
import { db } from './utils/db';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('doctors');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [doctors, setDoctors] = useState<Doctor[]>(() => db.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => db.getAppointments());
  const [specialties, setSpecialties] = useState<Specialty[]>(() => db.getSpecialties());
  const [settings, setSettings] = useState<AppSettings>(() => db.getSettings());
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All Specialties');

  useEffect(() => { db.saveDoctors(doctors); }, [doctors]);
  useEffect(() => { db.saveAppointments(appointments); }, [appointments]);
  useEffect(() => { db.saveSpecialties(specialties); }, [specialties]);
  useEffect(() => { db.saveSettings(settings); }, [settings]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All Specialties' || doctor.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, specialtyFilter]);

  const handleBook = (doctor: Doctor) => setSelectedDoctor(doctor);

  const handleConfirmAppointment = (details: { date: string; time: string; name: string; contact: string }) => {
    if (!selectedDoctor) return;
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientName: details.name,
      contactNumber: details.contact,
      date: details.date,
      time: details.time,
      status: 'Confirmed'
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setSelectedDoctor(null);
  };

  const handleAddDoctor = (d: Doctor) => setDoctors(prev => [...prev, d]);
  const handleUpdateDoctor = (updated: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
  };
  const handleDeleteDoctor = (id: string) => {
    if (confirm("Are you sure?")) setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const handleSpecialtyAISelect = (s: Specialty) => {
    setSpecialtyFilter(s);
    setCurrentView('doctors');
  };

  const handleAdminLogin = (password: string) => {
    if (password === 'AkotaHospital') {
      setIsAdminAuthenticated(true);
    }
  };

  const renderContent = () => {
    if (currentView === 'admin' && !isAdminAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} onCancel={() => setCurrentView('doctors')} />;
    }

    switch (currentView) {
      case 'doctors':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 text-black">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-[#1e6db2]"></i>
                Find a Doctor
              </h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-4">
                  <span className="text-black font-medium">Specialty:</span>
                  <select 
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px] text-black bg-white"
                  >
                    <option value="All Specialties">All Specialties</option>
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search doctor by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
                  />
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBook} />
              ))}
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 text-black">
            <h2 className="text-2xl font-bold text-black border-b pb-2">My History</h2>
            {appointments.length > 0 ? (
              appointments.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-black">{app.doctorName}</h3>
                    <p className="text-gray-600 text-sm">Patient: {app.patientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">{app.date}</p>
                    <p className="text-gray-600 text-sm">{app.time}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">CONFIRMED</span>
                </div>
              ))
            ) : <p className="text-center text-gray-500 py-20 font-medium">No appointments yet.</p>}
          </div>
        );
      case 'admin':
        return (
          <div className="relative text-black">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-black">Admin Control Panel</h2>
              <button 
                onClick={() => setIsAdminAuthenticated(false)}
                className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout Admin
              </button>
            </div>
            <AdminPanel 
              doctors={doctors} 
              appointments={appointments}
              specialties={specialties}
              settings={settings}
              onAddDoctor={handleAddDoctor} 
              onUpdateDoctor={handleUpdateDoctor}
              onDeleteDoctor={handleDeleteDoctor}
              onUpdateSpecialties={setSpecialties}
              onUpdateSettings={setSettings}
            />
          </div>
        );
      case 'profile':
      case 'records':
        return <div className="p-20 text-center text-black font-medium">Section Coming Soon...</div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-black">
      <Header currentView={currentView} onViewChange={setCurrentView} settings={settings} />
      <div className="flex flex-1 container mx-auto px-4 py-8 gap-8">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 min-w-0">{renderContent()}</main>
      </div>
      <AIChatbot onSpecialtySelect={handleSpecialtyAISelect} />
      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
          onConfirm={handleConfirmAppointment} 
        />
      )}
      <footer className="bg-white border-t py-8 text-center text-black font-medium text-xs mt-auto">
        &copy; 2024 {settings.appName} Management System. Empowered by Gemini AI.
      </footer>
    </div>
  );
};

export default App;
