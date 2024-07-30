import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaMovimientoInsumosComponent } from './acta-movimiento-insumos.component';

describe('ActaMovimientoInsumosComponent', () => {
  let component: ActaMovimientoInsumosComponent;
  let fixture: ComponentFixture<ActaMovimientoInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaMovimientoInsumosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActaMovimientoInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
