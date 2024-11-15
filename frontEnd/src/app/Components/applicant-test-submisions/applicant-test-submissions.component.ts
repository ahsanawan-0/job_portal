import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SubmissionData } from '../../models/jobModel';

@Component({
  selector: 'app-applicant-test-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicant-test-submissions.component.html',
  styleUrls: ['./applicant-test-submissions.component.css'],
})
export class ApplicantTestSubmissionsComponent implements OnInit, OnDestroy {
  submissionData: SubmissionData | null = null; // Initial value can be null
  isLoading: boolean = true;
  submissionId: string = '';
  applicantId: string = '';
  errorMessage: string | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private testService: TestServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.extractIds();
  }

  extractIds(): void {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((params) => {
      this.submissionId = params['submissionId'];
      this.applicantId = params['applicantId'];
      this.fetchSubmissionData();
    });
  }

  formId: string = '';
  fetchSubmissionData() {
    this.testService
      .getEvalutionOfApplicants(this.submissionId, this.applicantId)
      .subscribe(
        (data: SubmissionData) => {
          this.formId = data.formId;

          this.submissionData = data;
          console.log(this.submissionData);
          this.submissionData.evaluations.forEach((evaluation) => {
            if (!evaluation.options) {
              evaluation.options = []; // Ensure options is an array
            }
          });
          this.isLoading = false; // Data loaded successfully
        },
        (error: any) => {
          console.error('Error fetching submission data', error);
          this.errorMessage =
            'Failed to load submission data. Please try again.';
          this.isLoading = false; // Loading finished with error
        }
      );
  }

  onClickArrowLeft() {
    this.router.navigate([`/test-applicants-list/${this.formId}`]); // Adjust this path as needed
  }

  ngOnDestroy() {
    this.unsubscribe$.next(); // Unsubscribe to avoid memory leak
    this.unsubscribe$.complete();
  }
}
