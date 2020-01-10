import { SpiesBuilder } from 'src/app/utils/testUtils/builders/spies.builder';
import { DateFormat } from '../../services/time/model/date-format.enum';
import { DateFormatPipe } from './date-format.pipe';

fdescribe('Date Format Pipe', () => {
  let pipe: DateFormatPipe;
  const { timeService } = SpiesBuilder.init()
    .withTimeService()
    .build();

  beforeEach(() => {
    pipe = new DateFormatPipe(timeService);

    timeService.Extraction.getDaysAgoString.calls.reset();
    timeService.Extraction.getDateFormatted.calls.reset();

    timeService.Extraction.getDateFormatted.and.returnValue('dateFormatted');
    timeService.Extraction.getDaysAgoString.and.returnValue('daysAgo');
  });

  [
    DateFormat.DaysAgo,
    DateFormat.LongDayNameDayNumberLongMonthName,
    DateFormat.LongMonthName,
    DateFormat.MidDayNameDayNumberMidMonthName
  ].forEach((dateFormat: DateFormat) => {
    it(`should return correct string for date format: ${dateFormat.toString()}`, () => {
      // given
      const date = new Date();

      // when
      const result = pipe.transform(date, dateFormat);

      // then
      if (dateFormat === DateFormat.DaysAgo) {
        expect(result).toEqual('daysAgo');
        expect(timeService.Extraction.getDaysAgoString).toHaveBeenCalledTimes(1);
        expect(timeService.Extraction.getDateFormatted).not.toHaveBeenCalled();
        expect(timeService.Extraction.getDaysAgoString).toHaveBeenCalledWith(date);
      } else {
        expect(result).toEqual('dateFormatted');
        expect(timeService.Extraction.getDaysAgoString).not.toHaveBeenCalled();
        expect(timeService.Extraction.getDateFormatted).toHaveBeenCalledTimes(1);
        expect(timeService.Extraction.getDateFormatted).toHaveBeenCalledWith(date, dateFormat);
      }
    });
  });
});
