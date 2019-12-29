import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CalendarEvent } from 'calendar-utils';
import { FromToDates } from 'src/app/shared/components/from-to-dates/model/from-to-dates.model';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';
import { DialogAction } from '../../../../../shared/enum/dialog-action.enum';
import { DialogResult } from '../../../../../shared/models/dialog-result.model';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent {
  private editMode = false;

  public form: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      title: new FormControl('', CustomValidators.requiredValue),
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
      allDay: new FormControl(false)
    },
    { validators: CustomValidators.dateBefore('start', 'end') }
  );

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: { event: CalendarEvent },
    private dialogRef: MatDialogRef<NewEventDialogComponent>
  ) {
    if (this.data && this.data.event) {
      this.editMode = true;

      const { title, start, end, allDay, id } = this.data.event;
      this.form.setValue({ id, title, allDay, start, end });
    }
  }

  public getTitle(): string {
    return this.editMode ? 'Edit Event' : 'New event';
  }

  public save() {
    if (this.form.valid) {
      const action = this.editMode ? DialogAction.SaveUpdate : DialogAction.SaveAdd;
      const result: DialogResult = { action, payload: this.form.value };
      this.dialogRef.close(result);
    }
  }

  public delete() {
    const result: DialogResult = { action: DialogAction.Delete, payload: this.form.value };
    this.dialogRef.close(result);
  }

  public cancel() {
    const result: DialogResult = { action: DialogAction.Cancel };
    this.dialogRef.close(result);
  }

  public fromToDateChanged(fromToDates: FromToDates) {
    const value = {
      start: fromToDates.from,
      end: fromToDates.to,
      allDay: fromToDates.isAllDay
    };

    this.form.patchValue(value);
  }

  public getInitialAllDayFlag(): boolean {
    return this.editMode ? this.data.event.allDay : false;
  }

  public getInitialStartDate(): Date {
    return this.editMode ? this.data.event.start : null;
  }

  public getInitialEndDate(): Date {
    return this.editMode ? this.data.event.end : null;
  }
}
