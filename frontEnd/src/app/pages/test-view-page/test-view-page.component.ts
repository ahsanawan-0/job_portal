import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobApplicationService } from '../../services/job_application/job-application.service';

interface Question {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
}

interface TestFormResponse {
    title: string;
    duration: number;
    questions: Question[];
}

interface Applicant {
    name: string;
    email: string;
}

@Component({
    selector: 'app-test-view-page',
    templateUrl: './test-view-page.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    styleUrls: ['./test-view-page.component.css'],
})
export class TestViewPageComponent implements OnInit, OnDestroy {
    candidateForm: FormGroup;
    questions: Question[] = [];
    isLoading = false;
    errorMessage: string | null = null;
    submissionSuccess: boolean = false;
    title: string = '';
    formId: string = '';
    jobId: string|null = '';
    remainingTime: number = 0; // Remaining time in seconds
    formattedTime: string = ''; // Format for displaying time
    private timer: any; // Timer ID for interval
    applicantId: string | null = null; // To store applicant ID
    applicantName: string = ''; // To store applicant's name
    applicantEmail: string = ''; // To store applicant's email
    isAdminView: boolean = false; // To determine if it's admin view

token:string="";
    constructor(
        private testService: TestServiceService,
        private jobService: JobApplicationService,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.candidateForm = this.fb.group({
            name: [{ value: '', disabled: true }], // Disabled for the user
            email: [{ value: '', disabled: true }], // Disabled for the user
        });
    }
    ngOnInit(): void {
        this.formId = this.route.snapshot.paramMap.get('testId')!; 
        this.applicantId = this.route.snapshot.queryParamMap.get('applicant'); 
        this.jobId = this.route.snapshot.queryParamMap.get('jobId'); 
        this.token = this.route.snapshot.queryParamMap.get('token')!; 
        this.isAdminView = this.route.snapshot.url[0].path === 'test' && this.route.snapshot.url[1].path === 'admin';

    
        if (this.isAdminView) {
            // Admin view: Fetch test form without token
            console.log("adminview")
            this.fetchTestFormForAdmin();
          } else {
            if (!this.token) {
              this.errorMessage = 'No token provided.';
              
              return;
            }
            this.fetchApplicantData();
            this.fetchTestFormForCandidate(this.token);
          }
    }
    fetchApplicantData(): void {
        if (this.applicantId && this.jobId) {
            this.jobService.getApplicantById(this.applicantId,this.jobId).subscribe({
                next: (response: { message: string; data: Applicant }) => {
                    // Check if the response contains data
                    if (response.data) {
                        this.applicantName = response.data.name; // Store applicant's name
                        this.applicantEmail = response.data.email; // Store applicant's email
                        this.candidateForm.patchValue({
                            name: this.applicantName,
                            email: this.applicantEmail
                        });
                    } else {
                        this.errorMessage = 'No applicant data found.';
                    }
                },
                error: () => {
                    this.errorMessage = 'Failed to load applicant data.';
                }
            });
        }
    }

    fetchTestFormForCandidate(token:string): void {
        this.testService.getTestForm(this.formId,token).subscribe({
            next: (response: TestFormResponse) => {
                this.title = response.title;
                this.remainingTime = response.duration * 60;
                this.formattedTime = this.formatDuration(this.remainingTime); 
                this.questions = response.questions;
    
                // Add question controls to the form
                this.questions.forEach((question, index) => {
                    const controlName = `question_${index}`;
                    this.candidateForm.addControl(controlName, new FormControl('')); 
                });
    
                this.startTimer(); // Start the timer
                this.isLoading = false;
            },
            error: (err) => {
                if (err.status === 400) {
                    this.errorMessage = 'This link has already been used or has expired.';
                } else {
                    this.errorMessage = 'Failed to load test form.';
                }
                this.isLoading = false; // Ensure loading is set to false on error
            }
        });
    }
    fetchTestFormForAdmin(): void {
        this.testService.getTestFormForAdmin(this.formId).subscribe({
            next: (response: TestFormResponse) => {
                this.title = response.title;
                this.remainingTime = response.duration * 60;
                this.formattedTime = this.formatDuration(this.remainingTime); 
                this.questions = response.questions;
                this.startTimer(); // Start the timer
                this.isLoading = false;
                    // Add question controls to the form
                    this.questions.forEach((question, index) => {
                        const controlName = `question_${index}`;
                        this.candidateForm.addControl(controlName, new FormControl('')); 
                    });
        
                    this.startTimer(); // Start the timer
                    this.isLoading = false;
            },
          error: () => {
            this.errorMessage = 'Failed to load test form.';
            this.isLoading = false;
          },
        });
      }   ngOnDestroy(): void {
        clearInterval(this.timer); // Clear the timer when the component is destroyed
    }

    startTimer(): void {
        this.timer = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
                this.formattedTime = this.formatDuration(this.remainingTime); // Update formatted time
            } else {
                clearInterval(this.timer);
                this.submitAnswers(); // Optional: auto-submit when time is up
            }
        }, 1000);
    }

    formatDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;

        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours}h `;
        }
        formattedTime += `${minutes}m ${seconds}s`;

        return formattedTime.trim();
    }

    submitAnswers(): void {
        // Skip submission logic if it's an admin view
        if (this.isAdminView) {
            console.log("Admin view: Submission is disabled.");
            return;  // Prevent the form submission for admin view
        }
    
        // For candidate view, handle the form submission
        this.remainingTime = 0;
        this.formattedTime = this.formatDuration(this.remainingTime); 
    
        const structuredSubmissionData = {
            name: this.applicantName, // Use the stored applicant's name
            email: this.applicantEmail, // Use the stored applicant's email
            questions: this.questions.map((question) => ({
                id: question._id, 
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                answer: this.candidateForm.value[`question_${this.questions.indexOf(question)}`] || null // Get the answer
            }))
        };
    
        console.log('Submission Data:', structuredSubmissionData);
    
        // Send the structured data for submission to the server
        this.testService.submitTest(this.formId, structuredSubmissionData).subscribe({
            next: () => {
                this.submissionSuccess = true;
                this.errorMessage = null;
                this.candidateForm.reset(); // Reset the form after successful submission
            },
            error: (err) => {
                this.errorMessage = err.error.message;
                console.error(err);
            }
        });
    }
    
}