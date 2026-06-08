import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneFilmComponent } from './gestione-film.component';

describe('GestioneFilmComponent', () => {
  let component: GestioneFilmComponent;
  let fixture: ComponentFixture<GestioneFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneFilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
