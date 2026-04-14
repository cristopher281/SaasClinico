import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('especialidades')
export class Specialty {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;
}
