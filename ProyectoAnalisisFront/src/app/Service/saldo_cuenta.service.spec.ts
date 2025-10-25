import { TestBed } from '@angular/core/testing';

import { SaldoCuentaService } from './saldo_cuenta.service';

describe('SaldoCuentaService', () => {
  let service: SaldoCuentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaldoCuentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
