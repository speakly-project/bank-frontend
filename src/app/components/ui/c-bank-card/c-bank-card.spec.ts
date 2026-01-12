import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBankCard } from './c-bank-card';

describe('CBankCard', () => {
  let component: CBankCard;
  let fixture: ComponentFixture<CBankCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CBankCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CBankCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
