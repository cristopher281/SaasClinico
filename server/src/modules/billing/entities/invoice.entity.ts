import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';

@Entity('facturas')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id_factura: string;

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

  @Column({ nullable: true })
  id_consulta: string;

  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'id_consulta' })
  consulta: Consultation;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ length: 50, default: 'pendiente' })
  estado: string; // 'pendiente', 'pagada', 'parcial', 'cancelada'

  @CreateDateColumn()
  created_at: Date;
}
