import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const clinicId = request.user?.clinicId;

    if (clinicId) {
      void this.dataSource.query("SELECT set_config('app.current_clinic_id', $1, false)", [clinicId]);
    }

    return next.handle();
  }
}
