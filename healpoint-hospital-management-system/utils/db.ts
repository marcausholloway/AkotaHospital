
import { Doctor, Appointment, AppSettings, Specialty } from '../types';
import { INITIAL_DOCTORS, INITIAL_SPECIALTIES } from '../constants';

const DOCTORS_KEY = 'healpoint_doctors';
const APPOINTMENTS_KEY = 'healpoint_appointments';
const SETTINGS_KEY = 'healpoint_settings';
const SPECIALTIES_KEY = 'healpoint_specialties';

export const db = {
  getDoctors: (): Doctor[] => {
    const data = localStorage.getItem(DOCTORS_KEY);
    if (!data) {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    return JSON.parse(data);
  },
  saveDoctors: (doctors: Doctor[]) => localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors)),

  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveAppointments: (appointments: Appointment[]) => localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments)),

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      const defaultSettings = { appName: 'Akota Hospital', appIcon: 'fa-house-medical' };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(data);
  },
  saveSettings: (settings: AppSettings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)),

  getSpecialties: (): Specialty[] => {
    const data = localStorage.getItem(SPECIALTIES_KEY);
    if (!data) {
      localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(INITIAL_SPECIALTIES));
      return INITIAL_SPECIALTIES;
    }
    return JSON.parse(data);
  },
  saveSpecialties: (specialties: Specialty[]) => localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(specialties))
};
