import { NewEventFormValue } from '../../../model/new-event-form.model';

export class NewEventFormBuilder {
  private value: NewEventFormValue;

  private constructor() {
    this.value = {};
  }

  public static get NewValues(): NewEventFormBuilder {
    return new NewEventFormBuilder();
  }

  public withStartDate(date: Date): NewEventFormBuilder {
    this.value = { ...this.value, startDate: date };
    return this;
  }

  public withEndDate(date: Date): NewEventFormBuilder {
    this.value = { ...this.value, endDate: date };
    return this;
  }

  public withStartTimeHour(hour: number): NewEventFormBuilder {
    this.value = { ...this.value, startTimeHour: hour };
    return this;
  }

  public withStartTimeMinutes(minutes: number): NewEventFormBuilder {
    this.value = { ...this.value, startTimeMinutes: minutes };
    return this;
  }

  public withEndTimeHour(hour: number): NewEventFormBuilder {
    this.value = { ...this.value, endTimeHour: hour };
    return this;
  }

  public withEndTimeMinutes(minutes: number): NewEventFormBuilder {
    this.value = { ...this.value, endTimeMinutes: minutes };
    return this;
  }

  public build(): NewEventFormValue {
    return this.value;
  }
}
