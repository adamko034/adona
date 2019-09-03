import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { dayHours, hourQuartes } from 'src/app/utils/time/time.const';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  public showTimeSelects = true;
  public form: FormGroup = new FormGroup({
    title: new FormControl(''),
    startDate: new FormControl(''),
    startTimeHour: new FormControl(''),
    startTimeMinutes: new FormControl(''),
    endDate: new FormControl(''),
    endTimeHour: new FormControl(''),
    endTimeMinutes: new FormControl(''),
    allDayEvent: new FormControl(false)
  });

  public startHours: KeyValue<number, string>[];
  public startMinutes: KeyValue<number, string>[];
  public endHours: KeyValue<number, string>[];
  public endMinutes: KeyValue<number, string>[];

  public excludePastDaysFilter = (date: Date): boolean => {
    return (
      date >
      moment()
        .subtract(1, 'day')
        .endOf('day')
        .toDate()
    );
  };

  public constructor(private dialogRef: MatDialogRef<NewEventDialogComponent>) {}

  public ngOnInit() {
    this.form.patchValue({ startDate: new Date(), endDate: new Date() });
    this.startMinutes = hourQuartes;
    this.endMinutes = hourQuartes;
    this.form.patchValue({ startTimeMinutes: 0, endTimeMinutes: 0 });

    this.updateStartEndHours(new Date());
    this.startTimeMinutesChanged(0);
  }

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public updateStartEndHours(date: Date) {
    let currentDayHours = dayHours;

    if (this.isToday(date)) {
      currentDayHours = dayHours.filter(x => x.key >= moment().hours());
    }

    this.startHours = currentDayHours.filter(x => x.key < 24);
    this.endHours = currentDayHours;
    this.form.patchValue({ startTimeHour: this.startHours[0].key, endTimeHour: this.endHours[0].key });
  }

  public startTimeHourChanged(newHour: number) {
    this.endHours = this.startHours.filter(x => x.key >= newHour);

    if (this.form.value.startTimeMinutes === 45) {
      this.endHours = this.startHours.filter(x => x.key > newHour);
    }

    if (newHour > this.form.value.endTimeHour) {
      this.form.patchValue({ endTimeHour: this.endHours[0].key });
    }
  }

  public startTimeMinutesChanged(newStartMinute: number) {
    let newTimeMinutes = hourQuartes;

    if (newStartMinute !== 45) {
      this.endHours = this.startHours.filter(x => x.key >= this.form.value.startTimeHour);
      newTimeMinutes = newTimeMinutes.filter(x => x.key > newStartMinute);
    }

    if (newStartMinute === 45) {
      this.endHours = this.endHours.filter(x => x.key > this.endHours[0].key);
    }

    if (this.areStartEndHoursTheSame()) {
      if (newStartMinute === 45) {
        if (this.form.value.startTimeHour === 23) {
          const selectedStartDate = new Date(this.form.value.startDate);
          this.endHours = dayHours;
          this.endMinutes = hourQuartes;

          this.form.patchValue({
            endDate: moment(selectedStartDate)
              .add(1, 'd')
              .toDate(),
            endTimeHour: this.endHours[0].key,
            endTimeMinutes: this.endMinutes[0].key
          });
        } else {
          this.form.patchValue({ endTimeHour: this.form.value.startTimeHour + 1 });
        }
      }

      this.endMinutes = newTimeMinutes;
      this.form.patchValue({ endTimeMinutes: this.endMinutes[0].key });
    }
  }

  public endTimeHourChanged(newEndHour: number) {
    this.endMinutes = hourQuartes;

    if (
      this.form.value.startTimeHour === newEndHour &&
      this.form.value.startTimeMinutes >= this.form.value.endTimeMinutes
    ) {
      this.endMinutes = hourQuartes.filter(x => x.key > this.form.value.startTimeMinutes);
      this.form.patchValue({ endTimeMinutes: this.endMinutes[0].key });
    }
  }

  public startDateChanged(newDateString: string) {
    const newDate = new Date(newDateString);

    if (!this.isToday(newDate)) {
      this.startHours = dayHours;
      this.startMinutes = hourQuartes;

      const endDate = new Date(this.form.value.endDate);
      if (
        moment(newDate)
          .startOf('day')
          .isAfter(moment(endDate).startOf('day'))
      ) {
        this.form.patchValue({ endDate: newDate });
      }

      if (this.areStartEndDatesTheSame()) {
        this.endHours = this.startHours.filter(x => x.key >= this.startHours[12].key);
        this.endMinutes = hourQuartes;
      }

      this.form.patchValue({
        startTimeHour: this.startHours[12].key,
        startTimeMinutes: this.startMinutes[0].key,
        endTimeHour: this.endHours[0].key,
        endTimeMinutes: this.endMinutes[1].key
      });
    }
  }

  private areStartEndDatesTheSame() {
    const startDate = new Date(this.form.value.startDate);
    const endDate = new Date(this.form.value.endDate);

    return moment(startDate)
      .startOf('day')
      .isSame(moment(endDate).startOf('day'));
  }

  private areStartEndHoursTheSame() {
    return this.form.value.startTimeHour === this.form.value.endTimeHour;
  }

  private isToday(date: Date) {
    return moment()
      .startOf('day')
      .isSame(moment(date).startOf('day'));
  }
}
