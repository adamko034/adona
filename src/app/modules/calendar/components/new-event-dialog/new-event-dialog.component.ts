import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  private readonly dayHours: string[] = Array.from(Array(25).keys()).map(x =>
    x <= 9 ? `0${x}` : x.toString()
  );
  private readonly hourQuarters: string[] = ['00', '15', '30', '45'];

  public showTimeSelects = true;
  public form: FormGroup = new FormGroup({
    title: new FormControl(''),
    startDate: new FormControl(''),
    startTimeHour: new FormControl('00'),
    startTimeMinutes: new FormControl('00'),
    endDate: new FormControl(''),
    endTimeHour: new FormControl('00'),
    endTimeMinutes: new FormControl('00'),
    allDayEvent: new FormControl(false)
  });

  public hours = this.dayHours;
  public minutes = this.hourQuarters;

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

  public ngOnInit() {}

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public updateHours() {}
}
