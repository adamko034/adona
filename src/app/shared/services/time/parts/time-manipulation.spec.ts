import { TimeManipulationService } from 'src/app/shared/services/time/parts/time-manipulation.service';

describe('TimeManipulationService', () => {

  let service: TimeManipulationService;
  const dateFormat = 'dd-MM-yyyy hh:mm';

  beforeEach(() => {
    service = new TimeManipulationService();
  });

  describe('AddDays', () => {
    const inputs = [
      {
        date: new Date(2019, 5, 1, 10, 0),
        amount: 1,
        expected: new Date(2019, 5, 1, 11, 0)
      }
    ];

    for (const input of inputs) {
      it(`should return ${input.expected.toLocaleTimeString()} when adding ${input.amount} to ${input.date}`,
        () => {
          // when
          const result = service.addDays(input.amount, input.date);

          // then
          expect
      })
    }
