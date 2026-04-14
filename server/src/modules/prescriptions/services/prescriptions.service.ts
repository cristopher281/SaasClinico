import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionMedication } from '../entities/prescription-medication.entity';
import { Consultation } from '../../consultations/entities/consultation.entity';
import { Medication } from '../../medications/entities/medication.entity';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionsRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionMedication)
    private readonly prescriptionItemsRepository: Repository<PrescriptionMedication>,
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    @InjectRepository(Medication)
    private readonly medicationsRepository: Repository<Medication>,
  ) {}

  async create(clinicId: string, dto: CreatePrescriptionDto) {
    const consultation = await this.findConsultationForClinic(clinicId, dto.consultationId);
    const existingPrescription = await this.prescriptionsRepository.findOne({
      where: { consultationId: consultation.id },
    });

    if (existingPrescription) {
      throw new ConflictException('La consulta ya tiene una receta registrada.');
    }

    await this.ensureMedicationCatalog(dto.items.map((item) => item.medicationId));

    const prescription = await this.prescriptionsRepository.save(
      this.prescriptionsRepository.create({
        consultationId: consultation.id,
      }),
    );

    const items = dto.items.map((item) =>
      this.prescriptionItemsRepository.create({
        prescriptionId: prescription.id,
        medicationId: item.medicationId,
        dosis: item.dosis,
        frecuencia: item.frecuencia,
      }),
    );

    await this.prescriptionItemsRepository.save(items);
    return this.findOne(clinicId, prescription.id);
  }

  async findAll(clinicId: string, consultationId?: string) {
    const prescriptions = consultationId
      ? await this.prescriptionsRepository.find({
          where: { consultationId },
          order: { fecha: 'DESC' },
        })
      : await this.prescriptionsRepository.find({
          order: { fecha: 'DESC' },
        });

    const visible = [];
    for (const prescription of prescriptions) {
      try {
        visible.push(await this.findOne(clinicId, prescription.id));
      } catch {
        continue;
      }
    }
    return visible;
  }

  async findOne(clinicId: string, prescriptionId: string) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Receta no encontrada.');
    }

    const consultation = await this.findConsultationForClinic(clinicId, prescription.consultationId);
    const items = await this.prescriptionItemsRepository.find({
      where: { prescriptionId: prescription.id },
    });
    const medications = await this.medicationsRepository.find({
      where: { id: In(items.map((item) => item.medicationId)) },
      order: { nombre: 'ASC' },
    });

    return {
      ...prescription,
      consultation,
      items: items.map((item) => ({
        ...item,
        medication: medications.find((medication) => medication.id === item.medicationId) ?? null,
      })),
    };
  }

  async remove(clinicId: string, prescriptionId: string) {
    const prescription = await this.findOne(clinicId, prescriptionId);
    await this.prescriptionItemsRepository.delete({ prescriptionId: prescription.id });
    await this.prescriptionsRepository.delete({ id: prescription.id });
    return { message: 'Receta eliminada correctamente.' };
  }

  async getPrescriptionPreview(clinicId: string, prescriptionId: string) {
    const prescription = await this.findOne(clinicId, prescriptionId);
    return {
      prescription,
      html: this.renderPrescriptionHtml(prescription),
    };
  }

  private async findConsultationForClinic(clinicId: string, consultationId: string) {
    const consultation = await this.consultationsRepository.findOne({
      where: {
        id: consultationId,
        appointment: {
          clinicId,
        },
      },
      relations: {
        appointment: {
          patient: true,
          doctor: {
            user: true,
            specialty: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consulta no encontrada en la clinica.');
    }

    return consultation;
  }

  private async ensureMedicationCatalog(medicationIds: string[]) {
    const uniqueIds = Array.from(new Set(medicationIds));
    const medications = await this.medicationsRepository.find({
      where: { id: In(uniqueIds) },
    });

    if (medications.length !== uniqueIds.length) {
      throw new NotFoundException('Uno o mas medicamentos no existen en el catalogo.');
    }
  }

  private renderPrescriptionHtml(
    prescription: Awaited<ReturnType<PrescriptionsService['findOne']>>,
  ) {
    const clinic = prescription.consultation.appointment.clinic as Clinic;
    const template =
      clinic?.prescriptionTemplateHtml ??
      `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 32px; color: #17242e;">
          <header style="border-bottom:2px solid #d8d4c9;padding-bottom:16px;margin-bottom:24px;">
            <h1 style="margin:0;">{{clinicName}}</h1>
            <div>NIT/RUC: {{taxId}}</div>
            <div>Paciente: {{patientName}}</div>
            <div>Doctor: {{doctorName}}</div>
          </header>
          <section>
            <h2>Receta medica</h2>
            <ul>
              {{items}}
            </ul>
          </section>
        </body>
      </html>
      `;

    const itemsHtml = prescription.items
      .map(
        (item) =>
          `<li><strong>${item.medication?.nombre ?? 'Medicamento'}</strong> - ${item.dosis ?? 'Sin dosis'} - ${item.frecuencia ?? 'Sin frecuencia'}</li>`,
      )
      .join('');

    return Object.entries({
      clinicName: clinic?.nombre ?? 'SaaS Clinico',
      taxId: clinic?.taxId ?? 'N/D',
      patientName: prescription.consultation.appointment.patient.nombre,
      doctorName: prescription.consultation.appointment.doctor.user.nombre,
      items: itemsHtml,
    }).reduce((output, [key, value]) => output.replace(new RegExp(`{{${key}}}`, 'g'), value), template);
  }
}

