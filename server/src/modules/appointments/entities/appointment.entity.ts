import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity('citas')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id_cita: string;

  @Column()
  id_clinica: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinica: Clinic;

  @Column()
  id_paciente: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'id_paciente' })
  paciente: Patient;

  @Column()
  id_doctor: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'id_doctor' })
  doctor: Doctor;

  @Column({ type: 'timestamp with time zone' })
  fecha_hora: Date;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // 'pendiente', 'confirmada', 'cancelada', 'completada'

  @CreateDateColumn()
  created_at: Date;
}
