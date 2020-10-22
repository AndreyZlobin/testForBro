import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  static deepClone(value: any): any { return JSON.parse(JSON.stringify(value)) }

  static stopSubscriptions(unsubscribe$: Subject<void>): void {
    unsubscribe$.next();
    unsubscribe$.complete();
  }

  scrollTop(): void {
    timer(0).pipe(tap(() => window.scrollTo(0, 0))).subscribe();
  }

  stopSubscriptions(unsubscribe$: Subject<void>): void {
    unsubscribe$.next();
    unsubscribe$.complete();
  }
}