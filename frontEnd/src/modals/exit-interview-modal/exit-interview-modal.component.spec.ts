import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitInterviewModalComponent } from './exit-interview-modal.component';

describe('ExitInterviewModalComponent', () => {
  let component: ExitInterviewModalComponent;
  let fixture: ComponentFixture<ExitInterviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitInterviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitInterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
