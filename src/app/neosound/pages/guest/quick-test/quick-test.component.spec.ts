import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTestComponent } from './quick-test.component';

describe('QuickTestComponent', () => {
  let component: QuickTestComponent;
  let fixture: ComponentFixture<QuickTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
