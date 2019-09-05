import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TimeService } from 'src/app/shared/utils/time/time.service';
import { NewEventFormValue } from '../../model/new-event-form.model';
import { NewEventFormBuilder } from './builders/new-event-form.builder';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  public showTimeSelects = true;
  public form: FormGroup = new FormGroup({
    title: new FormControl(''),
    startDate: new FormControl(new Date()),
    startTimeHour: new FormControl(12),
    startTimeMinutes: new FormControl(0),
    endDate: new FormControl(new Date()),
    endTimeHour: new FormControl(12),
    endTimeMinutes: new FormControl(0),
    allDayEvent: new FormControl(false)
  });

  public startHours: KeyValue<number, string>[];
  public startMinutes: KeyValue<number, string>[];
  public endHours: KeyValue<number, string>[];
  public endMinutes: KeyValue<number, string>[];

  public excludeLowerThanStartDate = (date: Date): boolean => {
    const startDate = new Date(this.form.value.startDate);

    if (this.timeService.areDatesTheSame(date, startDate)) {
      const startHour = this.form.value.startTimeHour;
      const startMinute = this.form.value.startTimeMinutes;

      return !(startHour === 23 && startMinute === 45);
    }

    return this.timeService.isDateBeforeOrEqualThan(startDate, date);
  };

  public constructor(private dialogRef: MatDialogRef<NewEventDialogComponent>, private timeService: TimeService) {}

  public ngOnInit() {
    const today = new Date();

    this.startHours = this.timeService.DayHours.getAll();
    this.startMinutes = this.timeService.HourQuarters.getAll();

    this.adjustEndDateTo(today);
    this.adjustEndTime();
  }

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
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

  private adjustEndTime(startDate?: Date, endDate?: Date, startHour?: number, startMinutes?: number, endHour?: number) {
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

  private patchFormValue(value: NewEventFormValue) {
    this.form.patchValue(value);
  }
}
