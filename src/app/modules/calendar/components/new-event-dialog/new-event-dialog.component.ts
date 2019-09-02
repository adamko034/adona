import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('')
  });

  public constructor(private dialogRef: MatDialogRef<NewEventDialogComponent>) {}

  public ngOnInit() {}

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }
}
