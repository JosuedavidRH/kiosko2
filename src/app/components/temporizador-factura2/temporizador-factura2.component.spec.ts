import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporizadorFactura2Component } from './temporizador-factura2.component';

describe('TemporizadorFactura2Component', () => {
  let component: TemporizadorFactura2Component;
  let fixture: ComponentFixture<TemporizadorFactura2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporizadorFactura2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporizadorFactura2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
