import { Component, OnInit } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Question {
    _id: string; // Unique identifier for the question
    question: string;
    options: string[];
    correctAnswer: string;
    answer: string | null;
}
interface TestFormResponse {
    title: string;
    duration: number;
    questions: Question[];
}

@Component({
    selector: 'app-test-view-page',
    templateUrl: './test-view-page.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    styleUrls: ['./test-view-page.component.css'],
})
export class TestViewPageComponent implements OnInit {
    candidateForm: FormGroup;
    questions: Question[] = [];
    isLoading = true;
    selectedOptions: { [key: number]: string } = {};
    errorMessage: string | null = null;
    submissionSuccess: boolean = false;
    formattedTime: string = '';
    title: string = '';
    formId: string =''


    constructor(private testService: TestServiceService, private fb: FormBuilder,private route: ActivatedRoute    ) {
        this.candidateForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            answers: this.fb.group({}) // Placeholder for dynamic answer controls

        });
    }

    ngOnInit(): void {
        this.formId = this.route.snapshot.paramMap.get('id')!; // Get the ID from route parameters

        this.fetchTestForm();
    }

    onOptionSelected(index: number, option: string): void {
        this.selectedOptions[index] = option;
    }

    fetchTestForm(): void {
        this.testService.getTestForm(this.formId).subscribe({
            next: (response: TestFormResponse) => {
                this.title = response.title;
                this.formattedTime = this.formatDuration(response.duration);
                this.questions = response.questions;

                const formControls: { [key: string]: FormControl } = {
                    name: new FormControl('', Validators.required),
                    email: new FormControl('', [Validators.required, Validators.email])
                };

                this.questions.forEach((question, index) => {
                    const controlName = `question_${index}`;
                    formControls[controlName] = new FormControl(question.answer || '', Validators.required);
                });

                this.candidateForm = this.fb.group(formControls);
                this.isLoading = false;
                console.log('Candidate Form:', this.candidateForm.value);
            },
            error: () => {
                this.errorMessage = 'Failed to load test form.';
                this.isLoading = false;
            }
        });
    }

    formatDuration(duration: number): string {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
    }

    submitAnswers(): void {
        if (this.candidateForm.valid) {
            const formId = this.formId; // Get the actual form ID
            const structuredSubmissionData = {
                name: this.candidateForm.value.name,
                email: this.candidateForm.value.email,
                questions: this.questions.map((question) => ({
                    id: question._id, // Include question ID
                    question: question.question,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    answer: this.candidateForm.value[`question_${this.questions.indexOf(question)}`] || null // Get the answer
                }))
            };
    
            console.log('Submission Data:', structuredSubmissionData); // Log the submission data for debugging
    
            this.testService.submitTest(formId, structuredSubmissionData).subscribe({
                next: () => {
                    this.submissionSuccess = true;
                    this.errorMessage = null;
                    this.candidateForm.reset();
                },
                error: (err) => {
                    this.errorMessage = 'Submission failed. Please try again.';
                    console.error(err);
                }
            });
        } else {
            this.candidateForm.markAllAsTouched(); // Marks all controls to show validation errors
            this.errorMessage = 'Please fill in all required fields.';
        }
    }
    
    
}
