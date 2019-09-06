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

  public constructor(
    private dialogRef: MatDialogRef<NewEventDialogComponent>,
    private timeService: TimeService
  ) {}

  public ngOnInit() {}

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  private patchFormValue(value: NewEventFormValue) {
    this.form.patchValue(value);
  }
}
