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
import { User } from '../../auth/entities/user.entity';
import { Specialty } from './specialty.entity';

@Entity('doctores')
export class Doctor {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_clinica', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinic: Clinic;

  @Column({ name: 'id_usuario', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ name: 'id_especialidad', type: 'uuid', nullable: true })
  specialtyId?: string | null;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'id_especialidad' })
  specialty?: Specialty | null;

  @Column({ length: 100, nullable: true })
  licencia?: string | null;

  @Column({ length: 255, nullable: true })
  opinion?: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
