import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAvgscoreByAgentComponent } from './assessment-avgscore-by-agent.component';

describe('AssessmentAvgscoreByAgentComponent', () => {
  let component: AssessmentAvgscoreByAgentComponent;
  let fixture: ComponentFixture<AssessmentAvgscoreByAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentAvgscoreByAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAvgscoreByAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
