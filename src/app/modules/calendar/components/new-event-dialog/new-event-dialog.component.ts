import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { hourQuartes } from 'src/app/shared/utils/time/time.const';
import { TimeService } from 'src/app/shared/utils/time/time.service';

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

  public excludeLowerThanStartDate = (date: Date): boolean => {
    const startDate = new Date(this.form.value.startDate);
    return date >= startDate;
  };

  public constructor(
    private dialogRef: MatDialogRef<NewEventDialogComponent>,
    private timeService: TimeService
  ) {}

  public ngOnInit() {
    this.form.patchValue({ startDate: new Date(), endDate: new Date() });
    this.startMinutes = hourQuartes;
    this.endMinutes = hourQuartes;
    this.form.patchValue({ startTimeMinutes: 0, endTimeMinutes: 0 });

    this.updateStartEndHoursAndMinutes(new Date());
    //this.startTimeMinutesChanged(0);
  }

  public save() {
    this.dialogRef.close(this.form.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

  public startDateChanged(newStartDate: Date) {}

  public updateStartEndHoursAndMinutes(date: Date) {
    this.startHours = this.timeService.DayHours.getAll();
    this.endHours = this.timeService.DayHours.getAll();

    let selectedStartHour = 12;
    let selectedEndHour = 12;
    let selectedStartMinute = 0;
    let selectedEndMinute = 0;

    if (this.timeService.isToday(date)) {
      this.startHours = this.timeService.DayHours.getGreaterOrEqualThen(this.timeService.nowHour);
      this.endHours = this.startHours;
      selectedStartHour = this.startHours[0].key;
      selectedEndHour = this.endHours[0].key;
    }

    this.form.patchValue({
      startTimeHour: selectedStartHour,
      endTimeHour: selectedEndHour
    });
  }

  public startTimeHourChanged(newHour: number) {
    //   this.endHours = this.startHours.filter(x => x.key >= newHour);
    //   if (this.form.value.startTimeMinutes === 45) {
    //     this.endHours = this.startHours.filter(x => x.key > newHour);
    //   }
    //   if (newHour > this.form.value.endTimeHour) {
    //     this.form.patchValue({ endTimeHour: this.endHours[0].key });
    //   }
  }

  public startTimeMinutesChanged(newStartMinute: number) {
    //   let newTimeMinutes = hourQuartes;
    //   if (newStartMinute !== 45) {
    //     this.endHours = this.startHours.filter(x => x.key >= this.form.value.startTimeHour);
    //     newTimeMinutes = newTimeMinutes.filter(x => x.key > newStartMinute);
    //   }
    //   if (newStartMinute === 45) {
    //     this.endHours = this.endHours.filter(x => x.key > this.endHours[0].key);
    //   }
    //   if (this.areStartEndHoursTheSame()) {
    //     if (newStartMinute === 45) {
    //       if (this.form.value.startTimeHour === 23) {
    //         const selectedStartDate = new Date(this.form.value.startDate);
    //         this.endHours = dayHours;
    //         this.endMinutes = hourQuartes;
    //         this.form.patchValue({
    //           endDate: moment(selectedStartDate)
    //             .add(1, 'd')
    //             .toDate(),
    //           endTimeHour: this.endHours[0].key,
    //           endTimeMinutes: this.endMinutes[0].key
    //         });
    //       } else {
    //         this.form.patchValue({ endTimeHour: this.form.value.startTimeHour + 1 });
    //       }
    //     }
    //     this.endMinutes = newTimeMinutes;
    //     this.form.patchValue({ endTimeMinutes: this.endMinutes[0].key });
    //   }
  }

  public endTimeHourChanged(newEndHour: number) {
    //   this.endMinutes = hourQuartes;
    //   if (
    //     this.form.value.startTimeHour === newEndHour &&
    //     this.form.value.startTimeMinutes >= this.form.value.endTimeMinutes
    //   ) {
    //     this.endMinutes = hourQuartes.filter(x => x.key > this.form.value.startTimeMinutes);
    //     this.form.patchValue({ endTimeMinutes: this.endMinutes[0].key });
    //   }
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
