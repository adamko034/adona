import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';
import { HourQuartersService } from 'src/app/shared/services/time/parts/hour-quarters.service';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { TimeCreationService } from 'src/app/shared/services/time/parts/time-creation.service';
import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';
import { TimeService } from 'src/app/shared/services/time/time.service';

describe('Time Service', () => {
  it('should create part services', () => {
    // when
    const timeService = new TimeService();

    // then
    expect(timeService).toBeTruthy();
    expect(timeService.Comparison).toBeTruthy();
    expect(timeService.Comparison instanceof TimeComparisonService).toBeTruthy();

    expect(timeService.Creation).toBeTruthy();
    expect(timeService.Creation instanceof TimeCreationService).toBeTruthy();

    expect(timeService.DayHours).toBeTruthy();
    expect(timeService.DayHours instanceof DayHoursService).toBeTruthy();

    expect(timeService.HourQuarters).toBeTruthy();
    expect(timeService.HourQuarters instanceof HourQuartersService).toBeTruthy();

    expect(timeService.Manipulation).toBeTruthy();
    expect(timeService.Manipulation instanceof TimeManipulationService).toBeTruthy();
  });
});
