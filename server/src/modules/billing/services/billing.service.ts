import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Payment } from '../entities/payment.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { TicketPrinterService } from '../printing/ticket-printer.service';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    private readonly ticketPrinterService: TicketPrinterService,
  ) {}

  async createInvoice(clinicId: string, dto: CreateInvoiceDto) {
    const appointment = await this.findAppointmentForClinic(clinicId, dto.appointmentId);
    const existingInvoice = await this.invoicesRepository.findOne({
      where: { appointmentId: dto.appointmentId },
    });

    if (existingInvoice) {
      throw new ConflictException('La cita ya tiene una factura registrada.');
    }

    const invoice = this.invoicesRepository.create({
      appointmentId: dto.appointmentId,
      numero: this.generateInvoiceNumber(),
      concepto: dto.concepto ?? appointment.motivo ?? 'Consulta medica',
      cantidadPago: dto.cantidadPago,
      estado: dto.cantidadPago > 0 ? 'pendiente' : 'pagada',
    });

    return this.findInvoiceById(clinicId, (await this.invoicesRepository.save(invoice)).id);
  }

  async listInvoices(
    clinicId: string,
    filters: { estado?: string; patientId?: string; doctorId?: string },
  ) {
    return this.invoicesRepository.find({
      where: {
        estado: filters.estado,
        appointment: {
          clinicId,
          patientId: filters.patientId,
          doctorId: filters.doctorId,
        },
      },
      relations: {
        appointment: {
          clinic: true,
          patient: true,
          doctor: {
            user: true,
            specialty: true,
          },
        },
      },
      order: { fecha: 'DESC' },
    });
  }

  async findInvoiceById(clinicId: string, invoiceId: string) {
    const invoice = await this.invoicesRepository.findOne({
      where: {
        id: invoiceId,
        appointment: {
          clinicId,
        },
      },
      relations: {
        appointment: {
          clinic: true,
          patient: true,
          doctor: {
            user: true,
            specialty: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada.');
    }

    const payments = await this.paymentsRepository.find({
      where: { invoiceId: invoice.id },
      order: { fecha: 'DESC' },
    });

    return this.attachTotals(invoice, payments);
  }

  async updateInvoice(clinicId: string, invoiceId: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findInvoiceRecord(clinicId, invoiceId);
    const totals = await this.calculatePaymentTotals(invoice.id, Number(invoice.cantidadPago ?? 0));

    if (dto.cantidadPago !== undefined && dto.cantidadPago < totals.pagado) {
      throw new BadRequestException('El total de la factura no puede ser menor a lo ya pagado.');
    }

    Object.assign(invoice, {
      cantidadPago: dto.cantidadPago ?? invoice.cantidadPago,
      concepto: dto.concepto ?? invoice.concepto,
    });

    if (dto.estado === 'cancelada' && totals.pagado > 0) {
      throw new BadRequestException('No se puede cancelar una factura con pagos registrados.');
    }

    invoice.estado = dto.estado ?? this.resolveInvoiceStatus(totals.pagado, Number(invoice.cantidadPago ?? 0), invoice.estado);
    await this.invoicesRepository.save(invoice);
    return this.findInvoiceById(clinicId, invoice.id);
  }

  async createPayment(clinicId: string, invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.findInvoiceRecord(clinicId, invoiceId);

    if (invoice.estado === 'cancelada') {
      throw new BadRequestException('No se puede registrar pagos sobre una factura cancelada.');
    }

    const totalFactura = Number(invoice.cantidadPago ?? 0);
    const totals = await this.calculatePaymentTotals(invoice.id, totalFactura);
    if (totals.saldo <= 0) {
      throw new ConflictException('La factura ya se encuentra totalmente pagada.');
    }

    if (dto.monto > totals.saldo) {
      throw new BadRequestException('El pago excede el saldo pendiente de la factura.');
    }

    const payment = this.paymentsRepository.create({
      invoiceId: invoice.id,
      monto: dto.monto,
      metodo_pago: dto.metodoPago,
      fecha: dto.fecha ?? new Date().toISOString().slice(0, 10),
    });

    await this.paymentsRepository.save(payment);

    const updatedTotals = await this.calculatePaymentTotals(invoice.id, totalFactura);
    invoice.estado = this.resolveInvoiceStatus(updatedTotals.pagado, totalFactura, invoice.estado);
    await this.invoicesRepository.save(invoice);

    return this.findInvoiceById(clinicId, invoice.id);
  }

  async listPayments(clinicId: string, invoiceId: string) {
    await this.findInvoiceRecord(clinicId, invoiceId);
    return this.paymentsRepository.find({
      where: { invoiceId },
      order: { fecha: 'DESC' },
    });
  }

  async getPrintableTicket(clinicId: string, invoiceId: string) {
    const invoice = await this.findInvoiceById(clinicId, invoiceId);
    const consultation = await this.consultationsRepository.findOne({
      where: { appointmentId: invoice.appointmentId },
    });
    const ticket = this.renderTicket(invoice, consultation?.diagnostico ?? null);

    return {
      invoice,
      ticket,
    };
  }

  async printTicket(clinicId: string, invoiceId: string) {
    const printable = await this.getPrintableTicket(clinicId, invoiceId);
    const printResult = await this.ticketPrinterService.print(
      printable.invoice.numero,
      printable.ticket,
    );

    return {
      ...printable,
      print: printResult,
    };
  }

  async getInvoicePreview(clinicId: string, invoiceId: string) {
    const invoice = await this.findInvoiceById(clinicId, invoiceId);
    return {
      invoice,
      html: this.renderInvoiceHtml(invoice),
    };
  }

  private async findInvoiceRecord(clinicId: string, invoiceId: string) {
    const invoice = await this.invoicesRepository.findOne({
      where: {
        id: invoiceId,
        appointment: {
          clinicId,
        },
      },
      relations: {
        appointment: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada.');
    }

    return invoice;
  }

  private async findAppointmentForClinic(clinicId: string, appointmentId: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId, clinicId },
      relations: {
        patient: true,
        doctor: {
          user: true,
          specialty: true,
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada en la clinica.');
    }

    return appointment;
  }

  private async calculatePaymentTotals(invoiceId: string, totalFactura: number) {
    const payments = await this.paymentsRepository.find({ where: { invoiceId } });
    const pagado = payments.reduce((sum, payment) => sum + Number(payment.monto), 0);
    const saldo = Math.max(totalFactura - pagado, 0);
    return { pagado, saldo };
  }

  private attachTotals(invoice: Invoice, payments: Payment[]) {
    const total = Number(invoice.cantidadPago ?? 0);
    const pagado = payments.reduce((sum, payment) => sum + Number(payment.monto), 0);
    const saldo = Math.max(total - pagado, 0);

    return {
      ...invoice,
      cantidadPago: total,
      pagos: payments,
      resumenPago: {
        total,
        pagado,
        saldo,
      },
    };
  }

  private resolveInvoiceStatus(pagado: number, total: number, currentState?: string) {
    if (currentState === 'cancelada') {
      return 'cancelada';
    }

    if (pagado <= 0) {
      return total > 0 ? 'pendiente' : 'pagada';
    }

    if (pagado >= total) {
      return 'pagada';
    }

    return 'parcial';
  }

  private generateInvoiceNumber() {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      `${now.getMonth() + 1}`.padStart(2, '0'),
      `${now.getDate()}`.padStart(2, '0'),
      `${now.getHours()}`.padStart(2, '0'),
      `${now.getMinutes()}`.padStart(2, '0'),
      `${now.getSeconds()}`.padStart(2, '0'),
    ].join('');
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FAC-${stamp}-${suffix}`;
  }

  private renderTicket(
    invoice: Awaited<ReturnType<BillingService['findInvoiceById']>>,
    diagnostico: string | null,
  ) {
    const width = 42;
    const center = (value: string) => value.padStart(Math.floor((width + value.length) / 2)).padEnd(width);
    const line = '-'.repeat(width);
    const row = (label: string, value: string) => {
      const left = `${label}: `;
      return `${left}${value}`.slice(0, width).padEnd(width);
    };

    return [
      center(invoice.appointment.clinic?.nombre ?? 'SaaS Clinico'),
      center('Ticket de Facturacion'),
      line,
      row('Factura', invoice.numero),
      row('Fecha', new Date(invoice.fecha).toLocaleString('es-NI')),
      row('Paciente', invoice.appointment.patient.nombre),
      row('Cedula', invoice.appointment.patient.cedula),
      row('Doctor', invoice.appointment.doctor.user.nombre),
      row('Especialidad', invoice.appointment.doctor.specialty?.nombre ?? 'General'),
      row('Estado', invoice.estado),
      line,
      `Concepto: ${invoice.concepto ?? 'Consulta medica'}`.slice(0, width),
      diagnostico ? `Dx: ${diagnostico}`.slice(0, width) : ''.padEnd(width),
      line,
      row('Total', `${Number(invoice.resumenPago.total).toFixed(2)} USD`),
      row('Pagado', `${Number(invoice.resumenPago.pagado).toFixed(2)} USD`),
      row('Saldo', `${Number(invoice.resumenPago.saldo).toFixed(2)} USD`),
      line,
      center('Gracias por su visita'),
    ]
      .filter(Boolean)
      .join('\n');
  }

  private renderInvoiceHtml(invoice: Awaited<ReturnType<BillingService['findInvoiceById']>>) {
    const clinic = invoice.appointment.clinic as Clinic;
    const template =
      clinic?.invoiceTemplateHtml ??
      `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 32px; color: #17242e;">
          <header style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #d8d4c9;padding-bottom:16px;margin-bottom:24px;">
            <div>
              <h1 style="margin:0 0 8px 0;">{{clinicName}}</h1>
              <div>NIT/RUC: {{taxId}}</div>
              <div>Email: {{clinicEmail}}</div>
            </div>
            <div style="text-align:right;">
              <div><strong>Factura:</strong> {{invoiceNumber}}</div>
              <div><strong>Fecha:</strong> {{invoiceDate}}</div>
              <div><strong>Estado:</strong> {{invoiceStatus}}</div>
            </div>
          </header>
          <section style="margin-bottom:24px;">
            <div><strong>Paciente:</strong> {{patientName}}</div>
            <div><strong>Doctor:</strong> {{doctorName}}</div>
            <div><strong>Especialidad:</strong> {{specialty}}</div>
            <div><strong>Concepto:</strong> {{concept}}</div>
          </section>
          <section style="border:1px solid #d8d4c9;border-radius:16px;padding:16px;">
            <div><strong>Total:</strong> {{total}}</div>
            <div><strong>Pagado:</strong> {{paid}}</div>
            <div><strong>Saldo:</strong> {{balance}}</div>
          </section>
        </body>
      </html>
      `;

    return this.replaceTemplateTokens(template, {
      clinicName: clinic?.nombre ?? 'SaaS Clinico',
      taxId: clinic?.taxId ?? 'N/D',
      clinicEmail: clinic?.email ?? 'N/D',
      invoiceNumber: invoice.numero,
      invoiceDate: new Date(invoice.fecha).toLocaleString('es-NI'),
      invoiceStatus: invoice.estado,
      patientName: invoice.appointment.patient.nombre,
      doctorName: invoice.appointment.doctor.user.nombre,
      specialty: invoice.appointment.doctor.specialty?.nombre ?? 'General',
      concept: invoice.concepto ?? 'Consulta medica',
      total: `${Number(invoice.resumenPago.total).toFixed(2)} USD`,
      paid: `${Number(invoice.resumenPago.pagado).toFixed(2)} USD`,
      balance: `${Number(invoice.resumenPago.saldo).toFixed(2)} USD`,
    });
  }

  private replaceTemplateTokens(template: string, values: Record<string, string>) {
    return Object.entries(values).reduce((output, [key, value]) => {
      return output.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, template);
  }
}

