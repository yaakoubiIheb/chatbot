import { TestBed } from '@angular/core/testing';

import { FunctionRuleService } from './function-rule.service';

describe('FunctionRuleService', () => {
  let service: FunctionRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
