import { KeyValue } from '@angular/common';

const dayHours: KeyValue<number, string>[] = Array.from(Array(24).keys()).map((x: number) => {
  return { key: x, value: x <= 9 ? `0${x}` : x.toString() };
});

const hourQuarters: KeyValue<number, string>[] = [
  { key: 0, value: '00' },
  { key: 15, value: '15' },
  { key: 30, value: '30' },
  { key: 45, value: '45' }
];

export const timeConts = {
  dayHours,
  hourQuarters
};
