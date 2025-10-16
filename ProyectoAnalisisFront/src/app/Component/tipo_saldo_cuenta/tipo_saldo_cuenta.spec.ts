import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSaldoCuenta } from './tipo_saldo_cuenta';


describe('Usuario', () => {
  let component: TipoSaldoCuenta;
  let fixture: ComponentFixture<TipoSaldoCuenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSaldoCuenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSaldoCuenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
