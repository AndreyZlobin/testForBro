import { TestBed, inject } from '@angular/core/testing';

import { MediaRecorderService } from './media-recorder.service';

describe('MediaRecorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaRecorderService]
    });
  });

  it('should be created', inject([MediaRecorderService], (service: MediaRecorderService) => {
    expect(service).toBeTruthy();
  }));
});
