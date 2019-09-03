import { KeyValue } from '@angular/common';

export const dayHours: KeyValue<number, string>[] = Array.from(Array(25).keys()).map((x: number) => {
  return { key: x, value: x <= 9 ? `0${x}` : x.toString() };
});

export const hourQuartes: KeyValue<number, string>[] = [
  { key: 0, value: '00' },
  { key: 15, value: '15' },
  { key: 30, value: '30' },
  { key: 45, value: '45' }
];
