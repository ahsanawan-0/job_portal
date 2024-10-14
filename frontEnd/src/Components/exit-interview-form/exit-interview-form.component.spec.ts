import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitInterviewFormComponent } from './exit-interview-form.component';

describe('ExitInterviewFormComponent', () => {
  let component: ExitInterviewFormComponent;
  let fixture: ComponentFixture<ExitInterviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitInterviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitInterviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
