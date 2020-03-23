import { JasmineCustomMatchers } from 'src/app/utils/testUtils/jasmine-custom-matchers';
import { ScrollService } from './scroll.service';

describe('Scroll Service', () => {
  let service: ScrollService;
  const windowMock = jasmine.createSpyObj<Window>('window', ['scrollTo', 'scrollBy']);
  const documentMock = jasmine.createSpyObj<Document>('document', ['getElementById']);

  beforeEach(() => {
    service = new ScrollService(windowMock, documentMock);

    windowMock.scrollTo.calls.reset();
    windowMock.scrollBy.calls.reset();
    documentMock.getElementById.calls.reset();
  });

  it('should scroll to top', () => {
    // when
    service.scrollToTop();

    // then
    expect(windowMock.scrollTo).toHaveBeenCalledTimes(1);
    expect(windowMock.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should scroll to bottom', () => {
    // given
    const htmlElem = { scrollIntoView: () => {} };
    const htmlElemSpy = spyOn(htmlElem, 'scrollIntoView');

    documentMock.getElementById.withArgs('footer').and.returnValue(htmlElem as any);

    // when
    service.scrollToBottom();

    // then
    expect(documentMock.getElementById).toHaveBeenCalledTimes(1);
    expect(documentMock.getElementById).toHaveBeenCalledWith('footer');
    expect(htmlElemSpy).toHaveBeenCalledTimes(1);
  });

  it('should scroll to element if it has been found', () => {
    // given
    const htmlElem = { scrollIntoView: () => {} };
    const htmlElemSpy = spyOn(htmlElem, 'scrollIntoView');

    documentMock.getElementById.withArgs('someId').and.returnValue(htmlElem as any);

    // when
    service.scrollToElement('someId', 100);

    // then
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(htmlElemSpy, 1, true);
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(documentMock.getElementById, 1, 'someId');
    JasmineCustomMatchers.toHaveBeenCalledTimesWith(windowMock.scrollBy, 1, 0, 100);
  });

  it('should not scroll to element if it has not been found', () => {
    // given
    documentMock.getElementById.withArgs('someId').and.returnValue(null);

    // when
    service.scrollToElement('someId', 100);

    // then
    expect(documentMock.getElementById).toHaveBeenCalledTimes(1);
    expect(documentMock.getElementById).toHaveBeenCalledWith('someId');

    expect(windowMock.scrollBy).toHaveBeenCalledTimes(0);
  });
});
