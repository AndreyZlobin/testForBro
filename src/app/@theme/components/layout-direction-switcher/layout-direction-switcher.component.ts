import { Component, OnDestroy, Input } from '@angular/core';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-layout-direction-switcher',
  template: `
  `,
})
export class LayoutDirectionSwitcherComponent implements OnDestroy {
  directions = NbLayoutDirection;
  currentDirection: NbLayoutDirection;
  alive = true;

  @Input() vertical: boolean = false;

  constructor(private directionService: NbLayoutDirectionService) {
    this.currentDirection = this.directionService.getDirection();

    this.directionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(newDirection => this.currentDirection = newDirection);
  }

  toggleDirection(newDirection) {
    this.directionService.setDirection(newDirection);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
