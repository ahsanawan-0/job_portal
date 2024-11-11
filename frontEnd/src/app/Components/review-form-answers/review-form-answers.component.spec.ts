import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormAnswersComponent } from './review-form-answers.component';

describe('ReviewFormAnswersComponent', () => {
  let component: ReviewFormAnswersComponent;
  let fixture: ComponentFixture<ReviewFormAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormAnswersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
