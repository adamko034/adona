import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TimeService } from 'src/app/shared/services/time/time.service';
import { NewEventFormValue } from '../../model/new-event-form.model';
import { NewEventFormBuilder } from './builders/new-event-form.builder';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';

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

  public constructor(private dialogRef: MatDialogRef<NewEventDialogComponent>) {}

  public ngOnInit() {}

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public fromToDateChanged(fromToDates: FromToDates) {
    console.log(fromToDates);
  }

  private patchFormValue(value: NewEventFormValue) {
    this.form.patchValue(value);
  }
}
