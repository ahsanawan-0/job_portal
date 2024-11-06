import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { QuestionCard } from '../../models/jobModel';
import { ActivatedRoute, Router } from '@angular/router';
import { TestServiceService } from '../../services/test_service/test-service.service';

interface Question {
  _id: string;
  num_questions: number;
  interview_type: string;
  experience_level: string;
  field: string;
  createdAt: Date;
}

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css'],
})
export class QuestionCardComponent implements OnInit {
  @Input() questions: QuestionCard[] = []; // Accept questions from parent
  dropdownOpen: boolean[] = []; // Array to manage dropdown state
  constructor(private router: Router, private route: ActivatedRoute, private testService: TestServiceService) {}

  ngOnInit(): void {
    // Initialize dropdown state
    this.dropdownOpen = Array(this.questions.length).fill(false);
  }

  toggleDropdown(index: number): void {
    this.dropdownOpen[index] = !this.dropdownOpen[index]; // Toggle dropdown open state
  }

  createForm(question: QuestionCard): void {
    // Navigate to the form component, passing the question ID as a parameter
    this.router.navigate(['/questionform', question._id]);
  }
  viewQuestions(question: QuestionCard): void {
    this.router.navigate(['/viewQuestions', question._id]);
  }

  deleteQuestion(question: QuestionCard): void {
    console.log('Delete Question ID:', question._id);
  
    // Call the service method to delete the question
    this.testService.deleteGeneratedQuestion(question._id).subscribe({
      next: (response:any) => {
        console.log('Question deleted successfully:', response);
        // Optionally, refresh the list of questions or update the UI
        this.questions = this.questions.filter(q => q._id !== question._id); // Remove deleted question from the UI
      },
      error: (error:any) => {
        console.error('Error deleting question:', error);
        // Show an error message to the user if needed
      }
    });
  }
}