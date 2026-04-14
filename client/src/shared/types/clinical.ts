export type AuthResponse = {
  access_token: string;
  role?: string;
  clinicId?: string;
  clinic?: {
    id: string;
    nombre: string;
  };
};

export type AppRole = "admin" | "doctor" | "recepcionista" | "cajero" | "paciente" | "unknown";

export type UserProfile = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  clinicId: string;
  clinic: {
    id: string;
    nombre: string;
    taxId?: string | null;
    telefono?: string | null;
    email?: string | null;
    logoUrl?: string | null;
  };
};

export type Patient = {
  id: string;
  nombre: string;
  cedula: string;
  fechaNacimiento?: string | null;
  sexo?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
};

export type Doctor = {
  id: string;
  licencia?: string | null;
  user: {
    nombre: string;
    email: string;
  };
  specialty?: {
    id: string;
    nombre: string;
  } | null;
};

export type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  motivo?: string | null;
  patient: Patient;
  doctor: Doctor;
};

export type Consultation = {
  id: string;
  diagnostico: string;
  tratamiento?: string | null;
  observaciones?: string | null;
  appointment: Appointment;
};

export type Invoice = {
  id: string;
  numero: string;
  concepto?: string | null;
  estado: string;
  fecha: string;
  cantidadPago: number;
  appointment: Appointment;
  resumenPago?: {
    total: number;
    pagado: number;
    saldo: number;
  };
};

export type Medication = {
  id: string;
  nombre: string;
  descripcion?: string | null;
};

export type Prescription = {
  id: string;
  consultation: Consultation;
  items: Array<{
    id: string;
    dosis?: string | null;
    frecuencia?: string | null;
    medication: Medication | null;
  }>;
};

export type LaboratoryRecord = {
  id: string;
  resultado?: string | null;
  consultation: Consultation;
};

export type StaffUser = {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
  specialtyId?: string | null;
  specialty?: {
    id: string;
    nombre: string;
  } | null;
  licencia?: string | null;
};

export type ClinicOnboardingPayload = {
  clinicName: string;
  taxId: string;
  logoName?: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
};
