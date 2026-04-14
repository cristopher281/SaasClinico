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
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientsService } from '../services/patients.service';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  create(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientsService.create(user.clinicId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista', 'doctor')
  findAll(
    @CurrentUser() user: { clinicId: string },
    @Query('q') query?: string,
  ) {
    return this.patientsService.findAll(user.clinicId, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista', 'doctor')
  findOne(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.patientsService.findOne(user.clinicId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  update(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(user.clinicId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'recepcionista')
  remove(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.patientsService.remove(user.clinicId, id);
  }
}


