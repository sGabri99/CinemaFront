import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserisciFilmComponent } from './inserisci-film.component';

describe('InserisciFilmComponent', () => {
  let component: InserisciFilmComponent;
  let fixture: ComponentFixture<InserisciFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserisciFilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserisciFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
