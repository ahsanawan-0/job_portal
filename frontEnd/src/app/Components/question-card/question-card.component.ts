import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { QuestionCard } from '../../models/jobModel';
import { ActivatedRoute, Router } from '@angular/router';
import { TestServiceService } from '../../services/test_service/test-service.service';


@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css'],
})
export class QuestionCardComponent implements OnInit {
  @Input() questions: QuestionCard[] = []; 
  dropdownOpen: boolean[] = []; 
  constructor(private router: Router, private route: ActivatedRoute, private testService: TestServiceService) {}

  ngOnInit(): void {
    this.dropdownOpen = Array(this.questions.length).fill(false);
  }

  toggleDropdown(index: number): void {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }

  createForm(question: QuestionCard): void {
    this.router.navigate(['/questionform', question._id,question.job_id]);
  }
  viewQuestions(question: QuestionCard): void {
    this.router.navigate(['/viewQuestions', question._id]);
  }

  deleteQuestion(question: QuestionCard): void {
    console.log('Delete Question ID:', question._id);
  
    this.testService.deleteGeneratedQuestion(question._id).subscribe({
      next: (response:any) => {
        console.log('Question deleted successfully:', response);
    
        this.questions = this.questions.filter(q => q._id !== question._id);
      },
      error: (error:any) => {
        console.error('Error deleting question:', error);
          }
    });
  }
}