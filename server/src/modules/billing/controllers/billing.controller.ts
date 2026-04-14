import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { BillingService } from '../services/billing.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  createInvoice(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(user.clinicId, dto);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  listInvoices(
    @CurrentUser() user: { clinicId: string },
    @Query('estado') estado?: string,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.billingService.listInvoices(user.clinicId, {
      estado,
      patientId,
      doctorId,
    });
  }

  @Get('invoices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  findInvoice(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.billingService.findInvoiceById(user.clinicId, id);
  }

  @Patch('invoices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  updateInvoice(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.billingService.updateInvoice(user.clinicId, id, dto);
  }

  @Post('invoices/:id/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  createPayment(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.billingService.createPayment(user.clinicId, id, dto);
  }

  @Get('invoices/:id/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  listPayments(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.billingService.listPayments(user.clinicId, id);
  }

  @Get('invoices/:id/ticket')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  getTicket(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.billingService.getPrintableTicket(user.clinicId, id);
  }

  @Get('invoices/:id/preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  getPreview(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.billingService.getInvoicePreview(user.clinicId, id);
  }

  @Post('invoices/:id/print')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'cajero')
  printTicket(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.billingService.printTicket(user.clinicId, id);
  }
}


