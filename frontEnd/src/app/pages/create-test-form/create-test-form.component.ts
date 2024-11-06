import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { DynamicQuestionComponent } from '../../Components/dynamic-question/dynamic-question.component';

@Component({
    selector: 'app-create-test-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DynamicQuestionComponent],
    templateUrl: './create-test-form.component.html',
    styleUrls: ['./create-test-form.component.css']
})
export class CreateTestFormComponent implements OnInit {

    form: FormGroup;
    @ViewChild(DynamicQuestionComponent) dynamicQuestionComponent!: DynamicQuestionComponent;
    generatedQuestions: any[] = [];
    selectedQuestions: any[] = [];
    isDurationDropdownOpen: boolean = false;
    durations: number[] = [1, 30, 60, 90, 120]; 
    selectedDuration: number | null = null; // Use number to represent duration

    isLoading: boolean = false;
    errorMessage: string | null = null;
    isDropdownOpen: boolean = false;

    constructor(private fb: FormBuilder, private testService: TestServiceService, private router: Router,private route: ActivatedRoute) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            questions: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        const generatedQuestionId = this.route.snapshot.paramMap.get('question_id');

        if (generatedQuestionId) {
          this.fetchGeneratedQuestions(generatedQuestionId);
        }
    }
 
    fetchGeneratedQuestions(generatedQuestionId: string): void {
        this.isLoading = true;
        this.testService.fetchGeneratedQuestions(generatedQuestionId).subscribe({
            next: (questions) => {
                this.generatedQuestions = questions;
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Failed to load questions.';
                this.isLoading = false;
            }
        });
    }

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    toggleSelectAll(): void {
        if (this.areAllSelected()) {
            this.selectedQuestions = []; // Unselect all
        } else {
            this.selectedQuestions = [...this.generatedQuestions]; // Select all
        }
    }
    
    setDuration(event: Event): void {
        const selectElement = event.target as HTMLSelectElement; // Cast event target
        this.selectedDuration = Number(selectElement.value); // Store as a number
    }

    areAllSelected(): boolean {
        return this.selectedQuestions.length === this.generatedQuestions.length;
    }

    toggleQuestionSelection(question: any): void {
        const index = this.selectedQuestions.indexOf(question);
        if (index > -1) {
            this.selectedQuestions.splice(index, 1); // Unselect
        } else {
            this.selectedQuestions.push(question); // Select
        }
    }

    selectQuestion(question: any): void {
        const isAlreadySelected = this.questions.controls.some(control => control.get('question')?.value === question.question);
        if (!isAlreadySelected) {
            this.addQuestionToForm(question);
            this.toggleQuestionSelection(question);
        } else {
            alert('Question already selected!');
        }
    }

    addQuestionToForm(question: any): void {
        const questionGroup = this.fb.group({
            question: [question.question, Validators.required],
            answer: [null], // Initially set to null
            correctAnswer: [question.correctAnswer || null], // Store correct answer
            options: this.fb.array(question.options || []), // Add options as an array
        });

        this.questions.push(questionGroup);
    }

    unselectQuestion(index: number): void {
        this.questions.removeAt(index);
        this.selectedQuestions.splice(index, 1); // Remove from selected questions
        alert('Question has been unselected.');
    }

    get questions(): FormArray {
        return this.form.get('questions') as FormArray;
    }

    addDynamicQuestions(): void {
        const dynamicFormValues = this.dynamicQuestionComponent.form.value.questions;
        dynamicFormValues.forEach((question: any) => {
            const questionGroup = this.fb.group({
                question: [question.label, Validators.required],
                answer: [null], // Initially set to null
                correctAnswer: [question.correctAnswer || null], // Store correct answer
                options: this.fb.array(question.options.map((opt: string) => this.fb.control(opt, Validators.required))),
            });
            this.questions.push(questionGroup);
        });
    }

    createTest(): void {
        if (this.form.invalid || this.selectedDuration === null) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        const title = this.form.get('title')?.value;

        // Clear existing questions and add selected questions
        this.questions.clear(); // Clear existing questions in the form

        // Add selected questions to the form
        this.selectedQuestions.forEach(q => this.addQuestionToForm(q));
        
        // Add dynamic questions to the form
        this.addDynamicQuestions();

        // Create final data structure
        const questions = this.questions.value;

        // Log the final data structure
        console.log('Final Data to be Sent:', { title, questions });

        this.testService.createTest({ title, questions, duration: this.selectedDuration }).subscribe({
            next: () => {
                alert('Custom test created successfully!');
            },
            error: (error) => {
                this.errorMessage = error.message || 'An error occurred while creating the test.';
            }
        });
    }
onClickArrowLeft() {
  this.router.navigateByUrl('technicalinterview');
}
}