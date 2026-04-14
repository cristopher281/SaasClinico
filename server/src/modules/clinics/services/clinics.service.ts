import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from '../entities/clinic.entity';
import { UpdateClinicDto } from '../dto/update-clinic.dto';
import { extname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { env } from '../../../config/env';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicsRepository: Repository<Clinic>,
  ) {}

  async findById(id: string): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({ where: { id } });
    if (!clinic) {
      throw new NotFoundException('Clinica no encontrada.');
    }

    return clinic;
  }

  async update(id: string, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findById(id);

    Object.assign(clinic, {
      nombre: dto.nombre ?? clinic.nombre,
      taxId: dto.taxId ?? clinic.taxId ?? null,
      telefono: dto.telefono ?? clinic.telefono ?? null,
      email: dto.email ?? clinic.email ?? null,
      logoUrl: dto.logoUrl ?? clinic.logoUrl ?? null,
      prescriptionTemplateHtml:
        dto.prescriptionTemplateHtml ?? clinic.prescriptionTemplateHtml ?? null,
      invoiceTemplateHtml: dto.invoiceTemplateHtml ?? clinic.invoiceTemplateHtml ?? null,
    });

    return this.clinicsRepository.save(clinic);
  }

  async saveLogo(id: string, file: { originalname: string; buffer: Buffer }) {
    const clinic = await this.findById(id);
    const extension = extname(file.originalname || '').toLowerCase() || '.bin';
    const uploadsDir = join(process.cwd(), env.assets.uploadsDir, 'clinics');
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${clinic.id}-logo${extension}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, file.buffer);

    clinic.logoUrl = `/uploads/clinics/${fileName}`;
    await this.clinicsRepository.save(clinic);

    return {
      logoUrl: clinic.logoUrl,
      clinic,
    };
  }
}

