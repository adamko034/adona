import { LoaderComponent } from 'src/app/shared/components/ui/loader/loader.component';

describe('Loader Component', () => {
  let component: LoaderComponent;

  beforeEach(() => {
    component = new LoaderComponent();
  });

  describe('Diameter Get', () => {
    [
      { mode: 'spinner', expected: 40 },
      { mode: 'overlay', expected: 100 }
    ].forEach((input) => {
      it(`should be ${input.expected} for mode: ${input.mode}`, () => {
        component.mode = input.mode === 'spinner' ? 'spinner' : 'overlay';

        expect(component.diameter).toEqual(input.expected);
      });
    });
  });
});
