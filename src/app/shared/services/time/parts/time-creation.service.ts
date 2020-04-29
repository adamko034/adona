import { firestore } from 'firebase';

export class TimeCreationService {
  public from(date: Date, hour: number, minutes: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
  }

  public fromFirebaseTimestamp(timestamp: firestore.Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }
}
