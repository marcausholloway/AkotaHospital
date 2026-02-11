
import { Doctor } from './types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    image: 'https://picsum.photos/seed/sarah/200/200',
    availability: ['10:00 AM', '11:30 AM', '2:00 PM']
  },
  {
    id: '2',
    name: 'Dr. Michael Smith',
    specialty: 'Dermatologist',
    image: 'https://picsum.photos/seed/michael/200/200',
    availability: ['9:00 AM', '12:00 PM']
  }
];

export const INITIAL_SPECIALTIES = [
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Neurologist',
  'General Physician'
];
