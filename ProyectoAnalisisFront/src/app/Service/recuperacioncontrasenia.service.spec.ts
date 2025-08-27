import { TestBed } from '@angular/core/testing';

import { RecuperacioncontraseniaService } from './recuperacioncontrasenia.service';

describe('RecuperacioncontraseniaService', () => {
  let service: RecuperacioncontraseniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperacioncontraseniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
