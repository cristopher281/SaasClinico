import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('laboratorio')
export class Laboratory {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_consulta', type: 'uuid' })
  consultationId: string;

  @Column({ type: 'text', nullable: true })
  resultado?: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
