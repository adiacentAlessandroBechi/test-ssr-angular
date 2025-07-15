import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Isr } from './isr';

describe('Isr', () => {
  let component: Isr;
  let fixture: ComponentFixture<Isr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Isr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Isr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
