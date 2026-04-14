import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recetas')
export class Prescription {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_consulta', type: 'uuid' })
  consultationId: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
