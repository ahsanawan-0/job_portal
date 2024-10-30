import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitApplicantInfoComponent } from './exit-applicant-info.component';

describe('ExitApplicantInfoComponent', () => {
  let component: ExitApplicantInfoComponent;
  let fixture: ComponentFixture<ExitApplicantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitApplicantInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitApplicantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
