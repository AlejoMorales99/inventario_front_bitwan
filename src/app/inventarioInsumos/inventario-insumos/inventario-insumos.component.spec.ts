import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioInsumosComponent } from './inventario-insumos.component';

describe('InventarioInsumosComponent', () => {
  let component: InventarioInsumosComponent;
  let fixture: ComponentFixture<InventarioInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioInsumosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
