import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genero } from './genero';

describe('Genero', () => {
  let component: Genero;
  let fixture: ComponentFixture<Genero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
