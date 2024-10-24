import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicosInsumosComponent } from './tecnicos-insumos.component';

describe('TecnicosInsumosComponent', () => {
  let component: TecnicosInsumosComponent;
  let fixture: ComponentFixture<TecnicosInsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TecnicosInsumosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnicosInsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
