import { TestBed } from '@angular/core/testing';

import { ShootingService } from './shooting.service';

describe('ShootingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShootingService = TestBed.get(ShootingService);
    expect(service).toBeTruthy();
  });
});
