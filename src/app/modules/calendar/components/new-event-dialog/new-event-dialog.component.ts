import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    title: new FormControl(''),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    allDay: new FormControl(false)
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
    const value = {
      startDate: fromToDates.from,
      endDate: fromToDates.to,
      allDay: fromToDates.isAllDay
    };

    this.form.patchValue(value);
  }
}
