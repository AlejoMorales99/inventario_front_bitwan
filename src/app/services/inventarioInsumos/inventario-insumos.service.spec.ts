import { TestBed } from '@angular/core/testing';

import { InventarioInsumosService } from './inventario-insumos.service';

describe('InventarioInsumosService', () => {
  let service: InventarioInsumosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioInsumosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
