import { TestBed } from '@angular/core/testing';

import { TipoSaldoCuentaService } from './tipo_saldo_cuenta.service';

describe('TipoMovimientoCxCService', () => {
  let service: TipoSaldoCuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoSaldoCuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
