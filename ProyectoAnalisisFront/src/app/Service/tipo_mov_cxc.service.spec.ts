import { TestBed } from '@angular/core/testing';

import { TipoMovimientoCxCService } from './tipo_mov_cxc.service';

describe('TipoMovimientoCxCService', () => {
  let service: TipoMovimientoCxCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoMovimientoCxCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
