import { TestBed } from '@angular/core/testing';

import { OtherFunctionsService } from './other-functions.service';

describe('OtherFunctionsService', () => {
  let service: OtherFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
