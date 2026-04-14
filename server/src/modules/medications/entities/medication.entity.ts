import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medicamentos')
export class Medication {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;
}
