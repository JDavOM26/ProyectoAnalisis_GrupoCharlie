import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoUsuario } from './estatususuario';

describe('EstadoUsuario', () => {
  let component: EstadoUsuario;
  let fixture: ComponentFixture<EstadoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
