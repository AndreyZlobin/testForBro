import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileResultsComponent } from './file-results.component';

describe('FileResultsComponent', () => {
  let component: FileResultsComponent;
  let fixture: ComponentFixture<FileResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
