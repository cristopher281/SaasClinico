import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ConsultationsService } from '../services/consultations.service';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  create(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreateConsultationDto,
  ) {
    return this.consultationsService.create(user.clinicId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findAll(@CurrentUser() user: { clinicId: string }) {
    return this.consultationsService.findAll(user.clinicId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findOne(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.consultationsService.findOne(user.clinicId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  update(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: UpdateConsultationDto,
  ) {
    return this.consultationsService.update(user.clinicId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  remove(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.consultationsService.remove(user.clinicId, id);
  }
}


