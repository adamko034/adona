import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';
import { KeyValue } from '@angular/common';
import { TimeService } from 'src/app/shared/utils/time/time.service';

@Component({
  selector: 'app-from-to-dates',
  templateUrl: './from-to-dates.component.html',
  styleUrls: ['./from-to-dates.component.css']
})
export class FromToDatesComponent implements OnInit {
  @Output() dateChanged = new EventEmitter<FromToDates>();

  private startDate: Date;
  private endDate: Date;
  private startHour: number;
  private endHour: number;
  private startMinutes: number;
  private endMinutes: number;

  public startHoursOptions: KeyValue<number, string>[];
  public startMinutesOptions: KeyValue<number, string>[];
  public endHoursOptions: KeyValue<number, string>[];
  public endMinutesOptions: KeyValue<number, string>[];

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.startHoursOptions = this.timeService.DayHours.getAll();
    this.startMinutesOptions = this.timeService.HourQuarters.getAll();

    this.adjustEndDateTo(new Date());
    this.adjustEndTime();
  }

  public startDateChanged(newStartDate: Date) {
    this.adjustEndDateTo(newStartDate);
  }

  public endDateChanged(newEndDate: Date) {
    this.adjustEndTime(null, newEndDate, null, null);
  }

  public startTimeHourChanged(newHour: number) {
    this.adjustEndTime(null, null, newHour, null);
  }

  public startTimeMinutesChanged(newStartMinute: number) {
    this.adjustEndTime(null, null, null, newStartMinute);
  }

  public endTimeHourChanged(newHour: number) {
    this.adjustEndTime(null, null, null, null, newHour);
  }

  private adjustEndDateTo(date: Date) {
    let newEndDate = new Date();

    if (this.form.value.endDate) {
      const endDate = new Date(this.form.value.endDate);
      newEndDate = endDate;

      if (this.timeService.isDateBefore(endDate, date)) {
        newEndDate = date;
      }
    }

    const formValue = NewEventFormBuilder.NewValues.withEndDate(newEndDate).build();
    this.patchFormValue(formValue);
  }

  private adjustEndTime(
    startDate?: Date,
    endDate?: Date,
    startHour?: number,
    startMinutes?: number,
    endHour?: number
  ) {
    this.handleMidnight(startHour, startMinutes);

    startDate = startDate || new Date(this.form.value.startDate);
    endDate = endDate || new Date(this.form.value.endDate);
    startHour = startHour || this.form.value.startTimeHour;
    startMinutes = startMinutes || this.form.value.startTimeMinutes;
    let newEndHour = endHour || this.form.value.endTimeHour;
    let newEndMinute = this.form.value.endTimeMinutes;

    let newEndHours = this.timeService.DayHours.getAll();
    let newEndMinutes = this.timeService.HourQuarters.getAll();

    if (this.timeService.areDatesTheSame(startDate, endDate)) {
      newEndHours = this.timeService.DayHours.getGreaterOrEqualThen(startHour);

      if (startMinutes === 45) {
        newEndHours = this.timeService.DayHours.getGreaterThen(startHour);
      } else if (startHour === newEndHour) {
        newEndMinutes = this.timeService.HourQuarters.getGreaterThan(startMinutes);
      }

      if (startHour >= newEndHour) {
        newEndHour = newEndHours[0].key;
        if (startMinutes >= newEndMinute) {
          newEndMinute = newEndMinutes[0].key;
        }
      }
    }

    this.endHours = newEndHours;
    this.endMinutes = newEndMinutes;

    const formValue = NewEventFormBuilder.NewValues.withEndTimeHour(newEndHour)
      .withEndTimeMinutes(newEndMinute)
      .build();

    this.patchFormValue(formValue);
  }

  private handleMidnight(hour?: number, minutes?: number) {
    hour = hour || this.form.value.startTimeHour;
    minutes = minutes || this.form.value.startTimeMinutes;

    if (hour === 23 && minutes === 45) {
      const formValue = NewEventFormBuilder.NewValues.withEndDate(
        this.timeService.addDays(1, this.form.value.startDate)
      )
        .withEndTimeHour(12)
        .withEndTimeMinutes(0)
        .build();
      this.patchFormValue(formValue);
    }
  }
}
