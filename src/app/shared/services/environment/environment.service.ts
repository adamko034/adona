import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class EnvironmentService {
  public isProd(): boolean {
    return environment.production;
  }

  public isDev(): boolean {
    return !environment.production;
  }
}
