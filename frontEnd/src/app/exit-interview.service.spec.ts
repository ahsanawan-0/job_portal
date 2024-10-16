import { TestBed } from '@angular/core/testing';

import { ExitInterviewService } from './exit-interview.service';

describe('ExitInterviewService', () => {
  let service: ExitInterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitInterviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
