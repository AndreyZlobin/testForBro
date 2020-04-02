import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentNcallsAndNpositiveByQuestionComponent } from './assessment-ncalls-and-npositive-by-question.component';

describe('AssessmentNcallsAndNpositiveByQuestionComponent', () => {
  let component: AssessmentNcallsAndNpositiveByQuestionComponent;
  let fixture: ComponentFixture<AssessmentNcallsAndNpositiveByQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentNcallsAndNpositiveByQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentNcallsAndNpositiveByQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
