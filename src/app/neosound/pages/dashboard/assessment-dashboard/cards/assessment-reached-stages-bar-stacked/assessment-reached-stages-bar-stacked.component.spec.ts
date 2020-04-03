import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentReachedStagesBarStackedComponent } from './assessment-reached-stages-bar-stacked.component';

describe('AssessmentReachedStagesBarStackedComponent', () => {
  let component: AssessmentReachedStagesBarStackedComponent;
  let fixture: ComponentFixture<AssessmentReachedStagesBarStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentReachedStagesBarStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentReachedStagesBarStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
