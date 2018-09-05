import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDetailedComponent } from './signup-detailed.component';

describe('SignupDetailedComponent', () => {
  let component: SignupDetailedComponent;
  let fixture: ComponentFixture<SignupDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
