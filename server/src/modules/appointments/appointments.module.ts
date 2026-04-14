import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsController } from './controllers/appointments.controller';
import { AppointmentsService } from './services/appointments.service';
import { Patient } from '../patients/entities/patient.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient, Doctor])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService, TypeOrmModule],
})
export class AppointmentsModule {}

