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

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_clinica', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinic: Clinic;

  @Column({ length: 200 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password' })
  passwordHash: string;

  @Column()
  rol: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
