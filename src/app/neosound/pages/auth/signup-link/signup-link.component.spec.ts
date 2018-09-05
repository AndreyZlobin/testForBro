import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLinkComponent } from './signup-link.component';

describe('SignupLinkComponent', () => {
  let component: SignupLinkComponent;
  let fixture: ComponentFixture<SignupLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
