import { TestBed } from '@angular/core/testing';
import {Tab3Service} from '../tab3/tab3.service';


describe('Tab1ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Tab3Service = TestBed.get(Tab3Service);
    expect(service).toBeTruthy();
  });
});
