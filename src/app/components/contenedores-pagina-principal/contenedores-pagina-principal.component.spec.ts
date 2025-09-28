import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedoresPaginaPrincipalComponent } from './contenedores-pagina-principal.component';

describe('ContenedoresPaginaPrincipalComponent', () => {
  let component: ContenedoresPaginaPrincipalComponent;
  let fixture: ComponentFixture<ContenedoresPaginaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenedoresPaginaPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenedoresPaginaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
