import { Component, inject, OnInit } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generated-questions-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generated-questions-view.component.html',
  styleUrl: './generated-questions-view.component.css'
})
export class GeneratedQuestionsViewComponent implements OnInit{
  generatedQuestions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  constructor( private testService: TestServiceService,private route: ActivatedRoute) {}

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
router = inject(Router);
onClickArrowLeft() {
  this.router.navigateByUrl('technicalinterview');
}

}
