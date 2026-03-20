import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('pagos')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id_pago: string;

  @Column()
  id_factura: string;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'id_factura' })
  factura: Invoice;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ length: 50 })
  metodo_pago: string; // 'efectivo', 'tarjeta', 'transferencia'

  @CreateDateColumn()
  created_at: Date;
}
