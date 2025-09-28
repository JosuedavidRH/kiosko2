import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporizadorFactura3Component } from './temporizador-factura3.component';

describe('TemporizadorFactura3Component', () => {
  let component: TemporizadorFactura3Component;
  let fixture: ComponentFixture<TemporizadorFactura3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporizadorFactura3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporizadorFactura3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
