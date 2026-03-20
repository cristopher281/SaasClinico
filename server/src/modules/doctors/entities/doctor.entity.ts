import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { User } from '../../auth/entities/user.entity';
import { Specialty } from './specialty.entity';

@Entity('doctores')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id_doctor: string;

  @Column()
  id_clinica: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinica: Clinic;

  @Column()
  id_usuario: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column()
  id_especialidad: string;

  @ManyToOne(() => Specialty)
  @JoinColumn({ name: 'id_especialidad' })
  especialidad: Specialty;

  @Column({ length: 50, nullable: true })
  licencia_medica: string;

  @CreateDateColumn()
  created_at: Date;
}
