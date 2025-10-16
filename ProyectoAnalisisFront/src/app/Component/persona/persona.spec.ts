import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Persona } from './persona';

describe('Usuario', () => {
  let component: Persona;
  let fixture: ComponentFixture<Persona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Persona]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Persona);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
