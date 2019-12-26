export class TimeCreationService {
  public getDateTimeFrom(date: Date, hour: number, minutes: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
  }

  public getDateTimeFromMonthLoaded(monthLoaded: string) {
    const year = +monthLoaded.substring(0, 4);
    const month = +monthLoaded.substring(4, 6);

    return new Date(year, month - 1, 1);
  }
}
