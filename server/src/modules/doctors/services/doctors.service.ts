import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { Specialty } from '../entities/specialty.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private readonly specialtiesRepository: Repository<Specialty>,
  ) {}

  findAll(clinicId: string) {
    return this.doctorsRepository.find({
      where: { clinicId, activo: true },
      relations: { user: true, specialty: true },
      order: { createdAt: 'DESC' },
    });
  }

  findSpecialties() {
    return this.specialtiesRepository.find({
      order: { nombre: 'ASC' },
    });
  }
}

