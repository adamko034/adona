import { environment } from 'src/environments/environment';

export class Logger {
  public static logDev(text: string): void {
    if (!environment.production) {
      console.log(text);
    }
  }
}
