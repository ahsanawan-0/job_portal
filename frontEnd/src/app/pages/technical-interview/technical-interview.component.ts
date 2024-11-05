import { Component, OnInit } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormCard } from '../../models/jobModel';
import { FormCardComponent } from '../../Components/form-card/form-card.component';
import { QuestionCardComponent } from '../../Components/question-card/question-card.component';

@Component({
  selector: 'app-technical-interview',
  standalone: true,
  imports: [QuestionCardComponent, RouterLink, CommonModule, FormCardComponent],
  templateUrl: './technical-interview.component.html',
  styleUrls: ['./technical-interview.component.css'],
})
export class TechnicalInterviewComponent implements OnInit {
  tests: any[] = []; 
  forms: FormCard[] = []; 
  displayForms: boolean = false;
  displayQuestions: boolean = true; // Default to showing questions

  constructor(private testService: TestServiceService) {}

  ngOnInit(): void {
    this.loadAllTests(); 
    this.loadAllForms(); 
  }

  showForms() {
    this.displayForms = true;
    this.displayQuestions = false; // Hide questions when showing forms
  }

  showQuestions() {
    this.displayForms = false; // Hide forms when showing questions
    this.displayQuestions = true;
  }

  loadAllTests(): void {
    this.testService.getAllGeneratedQuestions().subscribe(
      (data: any) => {
        this.tests = data.map((test: any) => ({
          _id: test._id,
          num_questions: test.num_questions,
          interview_type: test.interview_type,
          experience_level: test.experience_level,
          field: test.field,
          createdAt: test.createdAt
        }));
      },
      (error: any) => {
        console.error('Error fetching tests:', error); 
      }
    );
  }

  loadAllForms(): void {
    this.testService.getAllGeneratedForms().subscribe(
      (data: FormCard[]) => {
        this.forms = data.map((form) => ({
          id: form.id,
          title: form.title,
          applicants: form.applicants || [],
        }));
        console.log(this.forms);
      },
      (error: any) => {
        console.error('Error fetching forms:', error);
      }
    );
  }
}