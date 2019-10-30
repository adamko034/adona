import { Injectable } from '@angular/core';
import { DayHoursService } from 'src/app/shared/services/time/parts/day-hours.service';
import { HourQuartersService } from './parts/hour-quarters.service';
import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';
import { TimeComparisonService } from 'src/app/shared/services/time/parts/time-comparison.service';
import { TimeCreationService } from 'src/app/shared/services/time/parts/time-creation.service';
import { TimeExtractionService } from 'src/app/shared/services/time/parts/time-extraction.service';

@Injectable()
export class TimeService {
  private dayHoursService: DayHoursService;
  private hourQuartersService: HourQuartersService;
  private timeManipulationService: TimeManipulationService;
  private timeComparisonService: TimeComparisonService;
  private timeCreationService: TimeCreationService;
  private timeExtractionService: TimeExtractionService;

  public get DayHours(): DayHoursService {
    return this.dayHoursService;
  }

  public get HourQuarters(): HourQuartersService {
    return this.hourQuartersService;
  }

  public get Manipulation(): TimeManipulationService {
    return this.timeManipulationService;
  }

  public get Comparison(): TimeComparisonService {
    return this.timeComparisonService;
  }

  public get Creation(): TimeCreationService {
    return this.timeCreationService;
  }

  public get Extraction(): TimeExtractionService {
    return this.timeExtractionService;
  }

  public constructor() {
    this.dayHoursService = new DayHoursService();
    this.hourQuartersService = new HourQuartersService();
    this.timeComparisonService = new TimeComparisonService();
    this.timeCreationService = new TimeCreationService();
    this.timeManipulationService = new TimeManipulationService();
    this.timeExtractionService = new TimeExtractionService();
  }
}
