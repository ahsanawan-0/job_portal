import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeModalComponent } from './date-time-modal.component';

describe('DateTimeModalComponent', () => {
  let component: DateTimeModalComponent;
  let fixture: ComponentFixture<DateTimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
