import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsRadialTreeComponent } from './keywords-radial-tree.component';

describe('KeywordsRadialTreeComponent', () => {
  let component: KeywordsRadialTreeComponent;
  let fixture: ComponentFixture<KeywordsRadialTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordsRadialTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsRadialTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
