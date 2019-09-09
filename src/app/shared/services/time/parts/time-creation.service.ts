export class TimeCreationService {
  public getDateTimeFrom(date: Date, hour: number, minutes: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
  }
}
