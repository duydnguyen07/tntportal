import { TestBed } from '@angular/core/testing';

import { EditApplicationService } from './edit-application.service';

describe('EditApplicationService', () => {
  let service: EditApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
