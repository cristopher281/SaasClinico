import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { BillingController } from './controllers/billing.controller';
import { BillingService } from './services/billing.service';
import { TicketPrinterService } from './printing/ticket-printer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Payment, Appointment, Consultation])],
  controllers: [BillingController],
  providers: [BillingService, TicketPrinterService],
  exports: [BillingService],
})
export class BillingModule {}

