import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewFormService } from '../../services/review_Form/review-form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form-answers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-form-answers.component.html',
  styleUrl: './review-form-answers.component.css',
})
export class ReviewFormAnswersComponent implements OnInit {
  service = inject(ReviewFormService);
  activatedRoute = inject(ActivatedRoute);
  route = inject(Router);
  applicantId: string = '';
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.applicantId = params['applicantId'];
    });
    this.getApplicantResponse();
  }

  answers: any[] = [];
  uniqueLinkId: string = '';
  getApplicantResponse() {
    this.service
      .getApplicantQuestionsAndAnswers(this.applicantId)
      .subscribe((res: any) => {
        this.answers = res.answers;
        this.uniqueLinkId = res.uniqueLinkId;
      });
  }

  onClickBack() {
    this.route.navigateByUrl(`reviewFormResults/${this.uniqueLinkId}`);
  }
}
