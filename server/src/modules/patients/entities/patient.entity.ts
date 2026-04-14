import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('pacientes')
export class Patient {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_clinica', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinic: Clinic;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 50 })
  cedula: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento?: string | null;

  @Column({ length: 20, nullable: true })
  sexo?: string | null;

  @Column({ length: 20, nullable: true })
  telefono?: string | null;

  @Column({ length: 150, nullable: true })
  email?: string | null;

  @Column({ type: 'text', nullable: true })
  direccion?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
