import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCursoDialog } from './c-curso-dialog';

describe('CCursoDialog', () => {
  let component: CCursoDialog;
  let fixture: ComponentFixture<CCursoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CCursoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCursoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
