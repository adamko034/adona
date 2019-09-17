import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CalendarEvent } from 'calendar-utils';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  private editMode = false;

  public form: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
    allDay: new FormControl(false)
  });

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent },
    private dialogRef: MatDialogRef<NewEventDialogComponent>
  ) {
    if (this.data && this.data.event) {
      this.editMode = true;

      const { title, start, end, allDay, id } = this.data.event;
      this.form.setValue({
        id,
        title,
        allDay,
        start,
        end
      });
    }
  }

  public ngOnInit() {}

  public getTitle(): string {
    return this.editMode ? 'Edit Event' : 'New event';
  }

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public fromToDateChanged(fromToDates: FromToDates) {
    const value = {
      start: fromToDates.from,
      end: fromToDates.to,
      allDay: fromToDates.isAllDay
    };

    this.form.patchValue(value);
  }

  public getInitialStartDate(): Date {
    return this.editMode ? this.data.event.start : null;
  }

  public getInitialEndDate(): Date {
    return this.editMode ? this.data.event.end : null;
  }
}
