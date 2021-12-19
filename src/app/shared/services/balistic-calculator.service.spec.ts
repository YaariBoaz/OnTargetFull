import { TestBed } from '@angular/core/testing';

import { BalisticCalculatorService } from './balistic-calculator.service';

describe('BalisticCalculatorService', () => {
  let service: BalisticCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalisticCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
