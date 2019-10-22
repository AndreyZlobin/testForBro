import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFilesListComponent } from './text-files-list.component';

describe('FilesListComponent', () => {
  let component: TextFilesListComponent;
  let fixture: ComponentFixture<TextFilesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextFilesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
