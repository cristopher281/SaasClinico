import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Specialty } from './entities/specialty.entity';
import { DoctorsController } from './controllers/doctors.controller';
import { DoctorsService } from './services/doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Specialty])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService, TypeOrmModule],
})
export class DoctorsModule {}

