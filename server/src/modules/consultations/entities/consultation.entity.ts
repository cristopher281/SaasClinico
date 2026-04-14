import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('consultas')
export class Consultation {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_cita', type: 'uuid' })
  appointmentId: string;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'id_cita' })
  appointment: Appointment;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ type: 'text', nullable: true })
  tratamiento?: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
