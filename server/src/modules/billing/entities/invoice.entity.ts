import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('facturas')
export class Invoice {
  @PrimaryGeneratedColumn('uuid', { name: 'id_p' })
  id: string;

  @Column({ name: 'id_cita', type: 'uuid' })
  appointmentId: string;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'id_cita' })
  appointment: Appointment;

  @Column({ length: 50 })
  numero: string;

  @Column({ type: 'text', nullable: true })
  concepto?: string | null;

  @Column({ name: 'cantidad_pago', type: 'decimal', precision: 12, scale: 2, nullable: true })
  cantidadPago?: number | null;

  @Column({ length: 50, default: 'pendiente' })
  estado: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
