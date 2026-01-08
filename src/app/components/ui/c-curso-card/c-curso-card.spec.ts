import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCursoCard } from './c-curso-card';

describe('CCursoCard', () => {
  let component: CCursoCard;
  let fixture: ComponentFixture<CCursoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCursoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCursoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
