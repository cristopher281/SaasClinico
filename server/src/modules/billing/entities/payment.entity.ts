import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_factura', type: 'uuid' })
  invoiceId: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'id_factura' })
  invoice: Invoice;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ length: 50 })
  metodo_pago: string;
}
