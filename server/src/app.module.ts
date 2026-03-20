import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { User } from './modules/auth/entities/user.entity';
import { Clinic } from './modules/clinics/entities/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'supersecretpassword',
      database: 'saas_clinica_db',
      entities: [User, Clinic],
      synchronize: true, // ¡OJO! Cambiar a false en producción
    }),
    AuthModule,
    ClinicsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
