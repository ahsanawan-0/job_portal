import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormViewComponent } from './review-form-view.component';

describe('ReviewFormViewComponent', () => {
  let component: ReviewFormViewComponent;
  let fixture: ComponentFixture<ReviewFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
