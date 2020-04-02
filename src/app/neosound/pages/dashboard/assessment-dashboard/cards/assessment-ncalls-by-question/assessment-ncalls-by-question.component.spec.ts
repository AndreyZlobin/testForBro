import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentNcallsByQuestionComponent } from './assessment-ncalls-by-question.component';

describe('AssessmentNcallsByQuestionComponent', () => {
  let component: AssessmentNcallsByQuestionComponent;
  let fixture: ComponentFixture<AssessmentNcallsByQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentNcallsByQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentNcallsByQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
