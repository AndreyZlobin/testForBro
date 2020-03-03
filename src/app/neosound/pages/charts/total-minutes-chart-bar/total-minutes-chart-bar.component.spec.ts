import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMinutesChartBarComponent } from './total-minutes-chart-bar.component';

describe('TotalMinutesChartBarComponent', () => {
  let component: TotalMinutesChartBarComponent;
  let fixture: ComponentFixture<TotalMinutesChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalMinutesChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMinutesChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
