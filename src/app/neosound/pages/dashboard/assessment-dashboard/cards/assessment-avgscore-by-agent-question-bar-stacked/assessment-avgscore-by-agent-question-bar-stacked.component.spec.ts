import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAvgscoreByAgentQuestionBarStackedComponent } from './assessment-avgscore-by-agent-question-bar-stacked.component';

describe('NgxAssessmentAvgscoreByAgentQuestionBarStackedComponent', () => {
  let component: AssessmentAvgscoreByAgentQuestionBarStackedComponent;
  let fixture: ComponentFixture<AssessmentAvgscoreByAgentQuestionBarStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentAvgscoreByAgentQuestionBarStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAvgscoreByAgentQuestionBarStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
