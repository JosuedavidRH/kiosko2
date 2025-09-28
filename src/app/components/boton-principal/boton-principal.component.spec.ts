import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonPrincipalComponent } from './boton-principal.component';

describe('BotonPrincipalComponent', () => {
  let component: BotonPrincipalComponent;
  let fixture: ComponentFixture<BotonPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
