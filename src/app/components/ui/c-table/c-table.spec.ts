import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTable } from './c-table';

describe('CTable', () => {
  let component: CTable;
  let fixture: ComponentFixture<CTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
