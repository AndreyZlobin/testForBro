import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsByDayChartLineComponent } from './calls-by-day-chart-line.component';

describe('CallsByDayChartLineComponent', () => {
  let component: CallsByDayChartLineComponent;
  let fixture: ComponentFixture<CallsByDayChartLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallsByDayChartLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsByDayChartLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
