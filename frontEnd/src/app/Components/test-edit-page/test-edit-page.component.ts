import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { DynamicQuestionComponent } from '../../Components/dynamic-question/dynamic-question.component';

@Component({
  selector: 'app-test-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicQuestionComponent],
  templateUrl: './test-edit-page.component.html',
  styleUrls: ['./test-edit-page.component.css'],
})
export class TestEditPageComponent implements OnInit {
  form: FormGroup;
  @ViewChild(DynamicQuestionComponent)
  dynamicQuestionComponent!: DynamicQuestionComponent;
  formData: any[] = [];
  selectedQuestions: any[] = [];
  isDurationDropdownOpen: boolean = false;
  durations: number[] = [1, 30, 60, 90, 120]; // Available durations in minutes
  selectedDuration: number | null = null; 

  isLoading: boolean = false;
  errorMessage: string | null = null;
  isDropdownOpen: boolean = false;
  testId: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private testService: TestServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('formId');

    if (this.testId) {
      // this.fetchFormData(this.testId);
    }
  }

  // fetchFormData(formId: string): void {
  //   this.isLoading = true;
  //   this.testService.getTestForm(formId).subscribe({
  //     next: (data) => {
  //       this.formData = data.questions;
  //       this.form.patchValue({
  //         title: data.title,
  //       });
  //       this.selectedDuration = data.duration; // Ensure this is set from backend
  //       console.log('Fetched Form Data:', data); // Debugging statement
  //       this.isLoading = false;
  //       this.populateQuestions(data.questions); // Populate questions once the data is fetched
  //     },
  //     error: () => {
  //       this.errorMessage = 'Failed to load questions.';
  //       this.isLoading = false;
  //     },
  //   });
  // }

  get formattedDuration(): string {
    if (this.selectedDuration === null) return 'Select Duration';
    const hours = Math.floor(this.selectedDuration / 60);
    const minutes = this.selectedDuration % 60;
    return `${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : ''} ${minutes > 0 ? minutes + ' minute' + (minutes > 1 ? 's' : '') : ''}`.trim() || '0 minutes';
  }

  populateQuestions(questions: any[]): void {
    this.questions.clear();
    questions.forEach((question) => this.addQuestionToForm(question));
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelectAll(): void {
    this.selectedQuestions = this.areAllSelected() ? [] : [...this.formData];
    console.log('Toggled Select All. Selected Questions:', this.selectedQuestions); // Debugging statement
  }

  setDuration(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedDuration = Number(selectElement.value);
    console.log('Selected Duration:', this.selectedDuration); // Debugging statement
  }

  areAllSelected(): boolean {
    return this.selectedQuestions.length === this.formData.length;
  }

  toggleQuestionSelection(question: any): void {
    const index = this.selectedQuestions.indexOf(question);
    if (index > -1) {
      this.selectedQuestions.splice(index, 1);
      console.log('Question unselected:', question); // Debugging statement
    } else {
      this.selectedQuestions.push(question);
      console.log('Question selected:', question); // Debugging statement
    }
    console.log('Current Selected Questions:', this.selectedQuestions); // Debugging statement
  }

  selectQuestion(question: any): void {
    if (!this.questions.controls.some(control => control.get('question')?.value === question.question)) {
      this.addQuestionToForm(question);
      this.toggleQuestionSelection(question);
    } else {
      alert('Question already selected!');
    }
  }

  addQuestionToForm(question: any): void {
    const questionGroup = this.fb.group({
      question: [question.question, Validators.required],
      answer: [null],
      correctAnswer: [question.correctAnswer || null],
      options: this.fb.array(question.options || []),
    });

    this.questions.push(questionGroup);
    console.log('Added Question to Form:', question); // Debugging statement
  }

  unselectQuestion(index: number): void {
    const question = this.questions.at(index).get('question')?.value; // Get the question to be unselected
    this.questions.removeAt(index);
    this.selectedQuestions.splice(this.selectedQuestions.indexOf(question), 1);
    alert('Question has been unselected.');
    console.log('Unselected Question:', question); // Debugging statement
    console.log('Updated Selected Questions:', this.selectedQuestions); // Debugging statement
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addDynamicQuestions(): void {
    const dynamicFormValues = this.dynamicQuestionComponent.form.value.questions;
    dynamicFormValues.forEach((question: any) => {
      this.addQuestionToForm({
        question: question.label,
        correctAnswer: question.correctAnswer || null,
        options: question.options || []
      });
    });
  }

  updateTest(): void {
    // Check for form validity and selected duration
    if (this.form.invalid || this.selectedDuration === null) {
        this.errorMessage = 'Please fill in all required fields.';
        return;
    }

    const title = this.form.get('title')?.value;

    // Gather all questions
    const allQuestions = this.questions.value; // Get all questions from the form
    console.log('All Questions:', allQuestions); // Debugging statement

    // Filter to get only selected questions
    const selectedQuestionsData = allQuestions.filter((question: any) => 
        this.selectedQuestions.includes(question)
    );

    console.log('Selected Questions Data:', selectedQuestionsData); // Debugging statement

    // Combine selected questions and newly added dynamic questions
    const finalQuestions = [
      ...selectedQuestionsData,
      ...this.dynamicQuestionComponent.form.value.questions
    ];

    // Log the final data structure
    console.log('Final Data to be Sent:', { title, questions: finalQuestions });

    // Send the data to the backend
    this.testService
        .updateTest(this.testId!, { title, questions: finalQuestions, duration: this.selectedDuration })
        .subscribe({
            next: () => {
                alert('Test updated successfully!');
                this.router.navigateByUrl('technicalinterview'); // Navigate after update
            },
            error: (error) => {
                this.errorMessage = error.message || 'An error occurred while updating the test.';
            },
        });
  }

  onClickArrowLeft() {
    this.router.navigateByUrl('technicalinterview');
  }
}