import { TestBed } from '@angular/core/testing';

import { RoleOpcionService } from './role-opcion.service';

describe('RoleOpcionService', () => {
  let service: RoleOpcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleOpcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
