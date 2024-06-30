import { TestBed } from '@angular/core/testing';

import { UserLoggerService } from './user-logger.service';

describe('UserLoggerService', () => {
  let service: UserLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
