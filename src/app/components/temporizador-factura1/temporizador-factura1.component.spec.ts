import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporizadorFactura1Component } from './temporizador-factura1.component';

describe('TemporizadorFactura1Component', () => {
  let component: TemporizadorFactura1Component;
  let fixture: ComponentFixture<TemporizadorFactura1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporizadorFactura1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporizadorFactura1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
