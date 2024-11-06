import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports:[ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private testServiceService: TestServiceService) {
    this.form = this.fb.group({
      num_questions: [1, [Validators.required, Validators.min(1)]],
      interview_type: ['', Validators.required],
      experience_level: ['', Validators.required],
      field: ['', Validators.required],
      interview_time: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  generateAIQuestions(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      console.log('Generating AI questions with:', formData);

      this.testServiceService.generateTestQuestion(formData).subscribe({
        next: (response: any) => {
          alert('AI questions generated successfully!');
          console.log('AI questions:', response);
          this.form.reset();
        },
        error: (error: any) => {
          console.error('Error generating AI questions:', error);
          alert('There was an error generating AI questions.');
        }
      });
    } else {
      alert('Please fill all required fields.');
    }
  }

  selectTag(controlName: string, tagValue: string): void {
    this.form.get(controlName)?.setValue(tagValue);
  }
  route = inject(Router);
  onClickArrowLeft() {
    this.route.navigateByUrl('technicalinterview');
  }
}

