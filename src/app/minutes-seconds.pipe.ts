import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const formatedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formatedSeconds =
      value - minutes * 60 < 10 ? '0' + (value - minutes * 60) : value - minutes * 60;
    return `${formatedMinutes}:${formatedSeconds}`;
  }
}
