import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { HealthModule } from './modules/health/health.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { BillingModule } from './modules/billing/billing.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { LaboratoryModule } from './modules/laboratory/laboratory.module';
import { User } from './modules/auth/entities/user.entity';
import { Clinic } from './modules/clinics/entities/clinic.entity';
import { Patient } from './modules/patients/entities/patient.entity';
import { Doctor } from './modules/doctors/entities/doctor.entity';
import { Specialty } from './modules/doctors/entities/specialty.entity';
import { Appointment } from './modules/appointments/entities/appointment.entity';
import { Consultation } from './modules/consultations/entities/consultation.entity';
import { Invoice } from './modules/billing/entities/invoice.entity';
import { Payment } from './modules/billing/entities/payment.entity';
import { Medication } from './modules/medications/entities/medication.entity';
import { Prescription } from './modules/prescriptions/entities/prescription.entity';
import { PrescriptionMedication } from './modules/prescriptions/entities/prescription-medication.entity';
import { Laboratory } from './modules/laboratory/entities/laboratory.entity';
import { env } from './config/env';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantContextInterceptor } from './common/interceptors/tenant-context.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.database.host,
      port: env.database.port,
      username: env.database.user,
      password: env.database.password,
      database: env.database.name,
      entities: [
        User,
        Clinic,
        Patient,
        Doctor,
        Specialty,
        Appointment,
        Consultation,
        Invoice,
        Payment,
        Medication,
        Prescription,
        PrescriptionMedication,
        Laboratory,
      ],
      synchronize: false,
    }),
    AuthModule,
    ClinicsModule,
    HealthModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    ConsultationsModule,
    BillingModule,
    MedicationsModule,
    PrescriptionsModule,
    LaboratoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantContextInterceptor,
    },
  ],
})
export class AppModule {}
