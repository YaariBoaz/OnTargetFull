import { TestBed } from '@angular/core/testing';

import { Tab1ServiceService } from './tab1-service.service';

describe('Tab1ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Tab1ServiceService = TestBed.get(Tab1ServiceService);
    expect(service).toBeTruthy();
  });
});
