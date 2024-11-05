import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantTestSubmissionsComponent } from './applicant-test-submissions.component'; // Corrected the import

describe('ApplicantTestSubmissionsComponent', () => {
  let component: ApplicantTestSubmissionsComponent;
  let fixture: ComponentFixture<ApplicantTestSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantTestSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantTestSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});