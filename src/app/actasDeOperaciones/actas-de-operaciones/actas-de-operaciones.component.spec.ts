import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActasDeOperacionesComponent } from './actas-de-operaciones.component';

describe('ActasDeOperacionesComponent', () => {
  let component: ActasDeOperacionesComponent;
  let fixture: ComponentFixture<ActasDeOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActasDeOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActasDeOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
