import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('citas')
export class Appointment {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_clinica', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinic: Clinic;

  @Column({ name: 'id_paciente', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'id_paciente' })
  patient: Patient;

  @Column({ name: 'id_doctor', type: 'uuid' })
  doctorId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ length: 50, default: 'pendiente' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  motivo?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
