import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLastTransactions } from './c-last-transactions';

describe('CLastTransactions', () => {
  let component: CLastTransactions;
  let fixture: ComponentFixture<CLastTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLastTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLastTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
