import type {
  Appointment,
  Consultation,
  Doctor,
  Invoice,
  LaboratoryRecord,
  Medication,
  Patient,
  Prescription,
  UserProfile,
} from "@/shared/types/clinical";

export type RoleModule = "overview" | "reception" | "doctor" | "billing";

export type DataBundle = {
  user: UserProfile;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  consultations: Consultation[];
  invoices: Invoice[];
  medications: Medication[];
  prescriptions: Prescription[];
  laboratory: LaboratoryRecord[];
};

export type ActionState = {
  submitting: boolean;
  error: string | null;
  success: string | null;
};

export type DashboardActions = {
  refresh: () => Promise<void>;
  createPatient: (payload: Partial<Patient>) => Promise<void>;
  updatePatient: (patientId: string, payload: Partial<Patient>) => Promise<void>;
  createAppointment: (payload: Record<string, unknown>) => Promise<void>;
  createConsultation: (payload: Record<string, unknown>) => Promise<void>;
  createInvoice: (payload: Record<string, unknown>) => Promise<void>;
  createPayment: (invoiceId: string, payload: Record<string, unknown>) => Promise<void>;
  printInvoice: (invoiceId: string) => Promise<void>;
  createPrescription: (payload: Record<string, unknown>) => Promise<void>;
  createLaboratory: (payload: Record<string, unknown>) => Promise<void>;
};
