import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitInterviewResultComponent } from './exit-interview-result.component';

describe('ExitInterviewResultComponent', () => {
  let component: ExitInterviewResultComponent;
  let fixture: ComponentFixture<ExitInterviewResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitInterviewResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitInterviewResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
