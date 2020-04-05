import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAvgscoreByAgentQuestionBarComponent } from './assessment-avgscore-by-agent-question-bar.component';

describe('AssessmentAvgscoreByAgentQuestionBarComponent', () => {
  let component: AssessmentAvgscoreByAgentQuestionBarComponent;
  let fixture: ComponentFixture<AssessmentAvgscoreByAgentQuestionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentAvgscoreByAgentQuestionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAvgscoreByAgentQuestionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
