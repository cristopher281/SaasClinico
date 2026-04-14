import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { ClinicsController } from './controllers/clinics.controller';
import { ClinicsService } from './services/clinics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [TypeOrmModule, ClinicsService],
})
export class ClinicsModule {}

