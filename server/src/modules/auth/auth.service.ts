import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';
import { RegisterClinicDto } from './dto/register-clinic.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async registerClinic(dto: RegisterClinicDto) {
    const { clinicName, adminEmail, adminPassword } = dto;

    const existingUser = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(adminPassword, salt);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const clinic = queryRunner.manager.create(Clinic, { nombre: clinicName });
      const savedClinic = await queryRunner.manager.save(clinic);

      const user = queryRunner.manager.create(User, {
        id_clinica: savedClinic.id_clinica,
        email: adminEmail,
        password_hash,
        rol: 'admin',
      });
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return {
        message: 'Clínica registrada exitosamente',
        clinicId: savedClinic.id_clinica,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const payload = { 
        sub: user.id_usuario, 
        email: user.email, 
        clinicId: user.id_clinica, 
        role: user.rol 
      };
      
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: user.rol,
        clinicId: user.id_clinica
      };
    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
