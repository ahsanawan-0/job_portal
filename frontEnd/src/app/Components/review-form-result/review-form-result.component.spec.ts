import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormResultComponent } from './review-form-result.component';

describe('ReviewFormResultComponent', () => {
  let component: ReviewFormResultComponent;
  let fixture: ComponentFixture<ReviewFormResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
