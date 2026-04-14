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
import { CreateLaboratoryDto } from '../dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from '../dto/update-laboratory.dto';
import { LaboratoryService } from '../services/laboratory.service';

@Controller('laboratory')
@UseGuards(JwtAuthGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  create(
    @CurrentUser() user: { clinicId: string },
    @Body() dto: CreateLaboratoryDto,
  ) {
    return this.laboratoryService.create(user.clinicId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findAll(
    @CurrentUser() user: { clinicId: string },
    @Query('consultationId') consultationId?: string,
  ) {
    return this.laboratoryService.findAll(user.clinicId, consultationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  findOne(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.laboratoryService.findOne(user.clinicId, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  update(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
    @Body() dto: UpdateLaboratoryDto,
  ) {
    return this.laboratoryService.update(user.clinicId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'doctor')
  remove(
    @CurrentUser() user: { clinicId: string },
    @Param('id') id: string,
  ) {
    return this.laboratoryService.remove(user.clinicId, id);
  }
}


