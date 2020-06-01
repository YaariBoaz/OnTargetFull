import { TestBed } from '@angular/core/testing';

import { HitNohitService } from './hit-nohit.service';

describe('HitNohitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HitNohitService = TestBed.get(HitNohitService);
    expect(service).toBeTruthy();
  });
});
