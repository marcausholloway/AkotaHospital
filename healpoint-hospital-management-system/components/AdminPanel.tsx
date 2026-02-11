
import React, { useState, useRef } from 'react';
import { Doctor, Specialty, Appointment, AppSettings } from '../types';

interface AdminPanelProps {
  doctors: Doctor[];
  appointments: Appointment[];
  specialties: Specialty[];
  settings: AppSettings;
  onAddDoctor: (doctor: Doctor) => void;
  onUpdateDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (id: string) => void;
  onUpdateSpecialties: (specialties: Specialty[]) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  doctors, 
  appointments, 
  specialties, 
  settings,
  onAddDoctor, 
  onUpdateDoctor,
  onDeleteDoctor,
  onUpdateSpecialties,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments' | 'specialties' | 'settings'>('doctors');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: specialties[0] || '',
    availability: '',
    image: ''
  });
  
  const [newSpecialty, setNewSpecialty] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingDoctor) {
          setEditingDoctor({ ...editingDoctor, image: base64String });
        } else {
          setNewDoctor({ ...newDoctor, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const availabilityArray = (editingDoctor ? editingDoctor.availability.join(',') : newDoctor.availability)
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    if (editingDoctor) {
      onUpdateDoctor({ ...editingDoctor, availability: availabilityArray });
      setEditingDoctor(null);
    } else {
      if (!newDoctor.name) return;
      onAddDoctor({
        id: Date.now().toString(),
        name: newDoctor.name,
        specialty: newDoctor.specialty,
        image: newDoctor.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
        availability: availabilityArray
      });
      setNewDoctor({ name: '', specialty: specialties[0] || '', availability: '', image: '' });
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      onUpdateSpecialties([...specialties, newSpecialty]);
      setNewSpecialty('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
      {/* Dynamic Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-full overflow-x-auto">
        {['doctors', 'appointments', 'specialties', 'settings'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap capitalize ${activeTab === tab ? 'bg-white text-[#1e6db2] shadow-sm' : 'text-black hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'doctors' && (
        <>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                <i className={`fa-solid ${editingDoctor ? 'fa-pen' : 'fa-plus'} text-sm`}></i>
              </div>
              {editingDoctor ? 'Edit Doctor Profile' : 'Register New Doctor'}
            </h2>
            <form onSubmit={handleSubmitDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-blue-200 outline-none transition-all text-black"
                  value={editingDoctor ? editingDoctor.name : newDoctor.name}
                  onChange={e => editingDoctor ? setEditingDoctor({...editingDoctor, name: e.target.value}) : setNewDoctor({...newDoctor, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest">Clinical Specialty</label>
                <select 
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white outline-none text-black"
                  value={editingDoctor ? editingDoctor.specialty : newDoctor.specialty}
                  onChange={e => editingDoctor ? setEditingDoctor({...editingDoctor, specialty: e.target.value}) : setNewDoctor({...newDoctor, specialty: e.target.value})}
                >
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest">Availability (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="09:00 AM, 02:00 PM"
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-xl px-4 py-3 focus:bg-white outline-none text-black"
                  value={editingDoctor ? editingDoctor.availability.join(', ') : newDoctor.availability}
                  onChange={e => editingDoctor ? setEditingDoctor({...editingDoctor, availability: e.target.value.split(',')}) : setNewDoctor({...newDoctor, availability: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase tracking-widest">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl px-4 py-2 text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-upload"></i> Upload Photo
                  </button>
                  {(editingDoctor?.image || newDoctor.image) && (
                    <img src={editingDoctor?.image || newDoctor.image} className="w-12 h-12 rounded-lg object-cover" alt="Preview" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#1e6db2] text-white py-4 rounded-xl font-black shadow-lg">
                  {editingDoctor ? 'Update Doctor Info' : 'Save New Doctor'}
                </button>
                {editingDoctor && (
                  <button type="button" onClick={() => setEditingDoctor(null)} className="bg-gray-200 text-black px-8 rounded-xl font-bold">Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-black">Active Doctor Registry</h2>
              <span className="text-xs font-bold text-black">{doctors.length} Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-black uppercase tracking-widest">Name</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-black uppercase tracking-widest">Specialty</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {doctors.map(d => (
                    <tr key={d.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-8 py-4 flex items-center gap-3">
                        <img src={d.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <span className="font-bold text-black">{d.name}</span>
                      </td>
                      <td className="px-8 py-4 text-sm text-black">{d.specialty}</td>
                      <td className="px-8 py-4 text-right flex justify-end gap-4">
                        <button onClick={() => setEditingDoctor(d)} className="text-blue-600 hover:text-blue-800"><i className="fa-solid fa-edit"></i></button>
                        <button onClick={() => onDeleteDoctor(d.id)} className="text-red-600 hover:text-red-800"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-2xl font-black text-black">Patient Log</h2>
            <span className="text-xs font-bold text-black">{appointments.length} Bookings</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest">Doctor</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-8 py-4 font-bold">{app.patientName}</td>
                    <td className="px-8 py-4 text-blue-600 font-medium">{app.doctorName}</td>
                    <td className="px-8 py-4 text-right">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Confirmed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'specialties' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
             <i className="fa-solid fa-layer-group text-blue-600"></i>
             Clinical Specialties
          </h2>
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Enter new specialty name" 
              className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-200"
              value={newSpecialty}
              onChange={e => setNewSpecialty(e.target.value)}
            />
            <button 
              onClick={handleAddSpecialty}
              className="bg-[#1e6db2] text-white px-8 rounded-xl font-bold"
            >
              Add Specialty
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map(s => (
              <div key={s} className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                <span className="font-bold text-sm">{s}</span>
                <button 
                  onClick={() => onUpdateSpecialties(specialties.filter(item => item !== s))}
                  className="text-red-400 hover:text-red-600"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
             <i className="fa-solid fa-cog text-blue-600"></i>
             System Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-black uppercase tracking-widest">Application Name</label>
              <input 
                type="text" 
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-200"
                value={settings.appName}
                onChange={e => onUpdateSettings({...settings, appName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-black uppercase tracking-widest">Application Icon (FontAwesome Class)</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-200"
                  value={settings.appIcon}
                  onChange={e => onUpdateSettings({...settings, appIcon: e.target.value})}
                />
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-[#1e6db2]">
                  <i className={`fa-solid ${settings.appIcon} text-xl`}></i>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Example: fa-hospital, fa-heart-pulse, fa-user-nurse</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
