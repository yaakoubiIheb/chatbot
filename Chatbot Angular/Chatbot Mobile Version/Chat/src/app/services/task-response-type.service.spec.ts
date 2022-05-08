import { TestBed } from '@angular/core/testing';

import { TaskResponseTypeService } from './task-response-type.service';

describe('TaskResponseTypeService', () => {
  let service: TaskResponseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskResponseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
