import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { CalendarConstants } from '../../../utils/calendar-constants';
import { CalendarListScrollComponent } from './calendar-list-scroll.component';

describe('CalendarListScrollComponent', () => {
  let component: CalendarListScrollComponent;
  const service: ScrollService = jasmine.createSpyObj<ScrollService>('scrollService', [
    'scrollToTop',
    'scrollToBottom',
    'scrollToElement'
  ]);

  beforeEach(() => {
    component = new CalendarListScrollComponent(service);
  });

  it('should scroll to top', () => {
    // when
    component.scrollToTop();

    // then
    expect(service.scrollToTop).toHaveBeenCalledTimes(1);
  });

  it('should scroll to bottom', () => {
    // when
    component.scrollToBottom();

    // then
    expect(service.scrollToBottom).toHaveBeenCalledTimes(1);
  });

  it('should scroll to today event container', () => {
    // when
    component.scrollToToday();

    // then
    expect(service.scrollToElement).toHaveBeenCalledTimes(1);
    expect(service.scrollToElement).toHaveBeenCalledWith(CalendarConstants.EventContainerTodayId, -50);
  });
});
