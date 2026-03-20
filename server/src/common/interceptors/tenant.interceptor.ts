import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Inyectado por el AuthGuard (JWT)

    if (user && user.clinicId) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      // Configura la sesión de Postgres con el ID de la clínica actual
      await queryRunner.query(`SET app.current_clinic_id = '${user.clinicId}'`);
      await queryRunner.release();
    }

    return next.handle();
  }
}
