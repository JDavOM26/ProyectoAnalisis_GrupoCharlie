import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoCuenta } from './saldo_cuenta';

describe('Usuario', () => {
  let component: SaldoCuenta;
  let fixture: ComponentFixture<SaldoCuenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoCuenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoCuenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
