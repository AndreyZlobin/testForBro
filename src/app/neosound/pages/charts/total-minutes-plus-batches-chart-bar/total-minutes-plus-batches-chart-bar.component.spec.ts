import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalMinutesPlusBatchesChartBarComponent } from './total-minutes-plus-batches-chart-bar.component';

describe('TotalMinutesPlusBatchesChartBarComponent', () => {
  let component: TotalMinutesPlusBatchesChartBarComponent;
  let fixture: ComponentFixture<TotalMinutesPlusBatchesChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalMinutesPlusBatchesChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalMinutesPlusBatchesChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
