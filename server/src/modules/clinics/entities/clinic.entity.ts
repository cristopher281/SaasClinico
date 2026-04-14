import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('clinicas')
export class Clinic {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ name: 'nit_ruc', length: 50, nullable: true })
  taxId?: string | null;

  @Column({ length: 20, nullable: true })
  telefono?: string | null;

  @Column({ length: 150, nullable: true })
  email?: string | null;

  @Column({ name: 'logo_url', length: 255, nullable: true })
  logoUrl?: string | null;

  @Column({ name: 'prescription_template_html', type: 'text', nullable: true })
  prescriptionTemplateHtml?: string | null;

  @Column({ name: 'invoice_template_html', type: 'text', nullable: true })
  invoiceTemplateHtml?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
