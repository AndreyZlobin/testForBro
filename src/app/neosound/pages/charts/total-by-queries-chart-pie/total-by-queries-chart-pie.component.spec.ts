import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalByQueriesChartPieComponent } from './total-by-queries-chart-pie.component';

describe('TotalByQueriesChartPieComponent', () => {
  let component: TotalByQueriesChartPieComponent;
  let fixture: ComponentFixture<TotalByQueriesChartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalByQueriesChartPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalByQueriesChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
