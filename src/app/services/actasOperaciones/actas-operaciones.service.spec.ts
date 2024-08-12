import { TestBed } from '@angular/core/testing';

import { ActasOperacionesService } from './actas-operaciones.service';

describe('ActasOperacionesService', () => {
  let service: ActasOperacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActasOperacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
