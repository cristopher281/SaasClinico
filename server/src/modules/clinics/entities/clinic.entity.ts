import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('clinicas')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id_clinica: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ default: 'basic' })
  plan_suscripcion: string;

  @CreateDateColumn()
  created_at: Date;
}
