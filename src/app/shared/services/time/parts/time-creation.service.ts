import { firestore } from 'firebase';

export class TimeCreationService {
  public from(date: Date, hour: number, minutes: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
  }

  public fromMonthLoaded(monthLoaded: string) {
    const year = +monthLoaded.substring(0, 4);
    const month = +monthLoaded.substring(4, 6);

    return new Date(year, month - 1, 1);
  }

  public fromFirebaseTimestamp(timestamp: firestore.Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }
}
