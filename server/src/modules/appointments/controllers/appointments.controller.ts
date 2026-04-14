import {
  Body,
  Controller,
  Delete,
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
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  create(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(user.clinicId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista', 'doctor', 'cajero')
  findAll(
    @CurrentUser() user: { clinicId: string },
    @Query('fecha') fecha?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('estado') estado?: string,
  ) {
    return this.appointmentsService.findAll(user.clinicId, {
      fecha,
      desde,
      hasta,
      doctorId,
      patientId,
      estado,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista', 'doctor', 'cajero')
  findOne(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.appointmentsService.findOne(user.clinicId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  update(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(user.clinicId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  remove(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.appointmentsService.remove(user.clinicId, id);
  }
}


