import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitInterviewFormDetailComponent } from './exit-interview-form-detail.component';

describe('ExitInterviewFormDetailComponent', () => {
  let component: ExitInterviewFormDetailComponent;
  let fixture: ComponentFixture<ExitInterviewFormDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitInterviewFormDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitInterviewFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
