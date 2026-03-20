import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('pacientes')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id_paciente: string;

  @Column()
  id_clinica: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinica: Clinic;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 50 })
  identificacion: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'text', nullable: true })
  historial_clinico: string;

  @CreateDateColumn()
  created_at: Date;
}
