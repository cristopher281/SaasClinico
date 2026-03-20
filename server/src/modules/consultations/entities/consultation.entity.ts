import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('consultas')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id_consulta: string;

  @Column()
  id_clinica: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinica: Clinic;

  @Column()
  id_cita: string;

  @OneToOne(() => Appointment)
  @JoinColumn({ name: 'id_cita' })
  cita: Appointment;

  @Column({ type: 'text' })
  motivo_consulta: string;

  @Column({ type: 'text', nullable: true })
  examen_fisico: string;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;
}
