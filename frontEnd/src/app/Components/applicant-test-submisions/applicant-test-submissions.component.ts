import { Component, OnInit } from '@angular/core';
import { TestServiceService } from '../../services/test_service/test-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applicant-test-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicant-test-submissions.component.html',
  styleUrls: ['./applicant-test-submissions.component.css']
})
export class ApplicantTestSubmissionsComponent implements OnInit {
  submissionData: any; 
  isLoading: boolean = true;
  submissionId:string=''

  constructor(private testService: TestServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.extractId()
    
  }
  extractId():void{
    this.route.params.subscribe((params)=>{
      this.submissionId=params["submissionId"]
      this.fetchSubmissionData();
      console.log(this.submissionId)
})
}
  fetchSubmissionData() {
    this.testService.getApplicantsSubmissions(this.submissionId).subscribe(
      (data: any) => {
        this.submissionData = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching submission data', error);
        this.isLoading = false;
      }
    );
  }

  onClickArrowLeft() {
  }
}