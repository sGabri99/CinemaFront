import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneSpettacoliComponent } from './gestione-spettacoli.component';

describe('GestioneSpettacoliComponent', () => {
  let component: GestioneSpettacoliComponent;
  let fixture: ComponentFixture<GestioneSpettacoliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestioneSpettacoliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestioneSpettacoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
