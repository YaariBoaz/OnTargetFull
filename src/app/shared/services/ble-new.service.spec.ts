import { TestBed } from '@angular/core/testing';

import { BleNewService } from './ble-new.service';

describe('BleNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BleNewService = TestBed.get(BleNewService);
    expect(service).toBeTruthy();
  });
});
