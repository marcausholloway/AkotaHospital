
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'AkotaHospital') {
      onLogin(password);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-lock text-2xl text-[#1e6db2]"></i>
        </div>
        <h2 className="text-2xl font-bold text-black">Admin Authentication</h2>
        <p className="text-black mt-2">Please enter the administrator password to proceed.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">Password</label>
          <input
            type="password"
            autoFocus
            className={`w-full border ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black`}
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            required
          />
          {error && <p className="text-red-500 text-xs mt-2 font-medium">Incorrect password. Please try again.</p>}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-[#1e6db2] text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-[0.98] transition-all"
          >
            Login to Dashboard
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-black py-2 hover:opacity-70 transition-colors text-sm font-medium"
          >
            Cancel and Return
          </button>
        </div>
      </form>
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-black font-medium italic">Demo Password: AkotaHospital</p>
      </div>
    </div>
  );
};
