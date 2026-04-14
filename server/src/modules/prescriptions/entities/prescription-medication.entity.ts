import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('receta_medicamento')
export class PrescriptionMedication {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_receta', type: 'uuid' })
  prescriptionId: string;

  @Column({ name: 'id_medicamento', type: 'uuid' })
  medicationId: string;

  @Column({ length: 100, nullable: true })
  dosis?: string | null;

  @Column({ length: 100, nullable: true })
  frecuencia?: string | null;
}
