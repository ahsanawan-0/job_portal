import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormAdminViewComponent } from './review-form-admin-view.component';

describe('ReviewFormAdminViewComponent', () => {
  let component: ReviewFormAdminViewComponent;
  let fixture: ComponentFixture<ReviewFormAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFormAdminViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFormAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
