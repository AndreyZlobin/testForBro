import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMinutesByDayChartLineComponent } from './total-minutes-by-day-chart-line.component';

describe('TotalMinutesByDayChartLineComponent', () => {
  let component: TotalMinutesByDayChartLineComponent;
  let fixture: ComponentFixture<TotalMinutesByDayChartLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalMinutesByDayChartLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMinutesByDayChartLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
