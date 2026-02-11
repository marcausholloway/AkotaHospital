
export type Specialty = string;

export interface AppSettings {
  appName: string;
  appIcon: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  image: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  contactNumber: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export type View = 'doctors' | 'appointments' | 'records' | 'admin' | 'profile';
