import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Medication } from '../entities/medication.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationsRepository: Repository<Medication>,
  ) {}

  findAll(query?: string) {
    if (!query?.trim()) {
      return this.medicationsRepository.find({
        order: { nombre: 'ASC' },
      });
    }

    const normalized = `%${query.trim()}%`;
    return this.medicationsRepository.find({
      where: [
        { nombre: ILike(normalized) },
        { descripcion: ILike(normalized) },
      ],
      order: { nombre: 'ASC' },
    });
  }
}

