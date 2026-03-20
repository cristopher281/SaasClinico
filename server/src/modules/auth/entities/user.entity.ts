import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column()
  id_clinica: string;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: 'id_clinica' })
  clinica: Clinic;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  rol: string; // 'admin', 'doctor', 'recepcionista', 'paciente'

  @CreateDateColumn()
  created_at: Date;
}
