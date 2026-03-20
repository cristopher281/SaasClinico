import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Clinic } from '../clinics/entities/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Clinic]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY_VERY_SECURE_123', // ¡OJO! Usar Variables de Entorno en Prod
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}
