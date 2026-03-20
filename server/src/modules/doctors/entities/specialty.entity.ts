import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('especialidades')
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  id_especialidad: string;

  @Column({ length: 100, unique: true })
  nombre: string;
}
