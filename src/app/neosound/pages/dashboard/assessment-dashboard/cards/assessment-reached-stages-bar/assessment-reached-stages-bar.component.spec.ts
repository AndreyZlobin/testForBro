import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentReachedStagesBarComponent } from './assessment-reached-stages-bar.component';

describe('AssessmentReachedStagesBarComponent', () => {
  let component: AssessmentReachedStagesBarComponent;
  let fixture: ComponentFixture<AssessmentReachedStagesBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentReachedStagesBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentReachedStagesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
