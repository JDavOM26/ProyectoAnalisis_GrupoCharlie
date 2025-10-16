import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMovimientoCxC } from './tipo_movimiento_cxc';


describe('Usuario', () => {
  let component: TipoMovimientoCxC;
  let fixture: ComponentFixture<TipoMovimientoCxC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoMovimientoCxC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoMovimientoCxC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
