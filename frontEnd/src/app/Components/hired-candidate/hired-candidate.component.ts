import { Component, inject, OnInit } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CapitalizeWordsPipe } from '../../Pipes/capitalize-words.pipe';

@Component({
  selector: 'app-hired-candidate',
  standalone: true,
  imports: [DatePipe, CommonModule, CapitalizeWordsPipe],
  templateUrl: './hired-candidate.component.html',
  styleUrl: './hired-candidate.component.css',
})
export class HiredCandidateComponent implements OnInit {
  service = inject(JobApplicationService);
  totalHiredCandidates: number = 0;

  ngOnInit(): void {
    this.getAllHiredCandidates();
  }

  applicants: any[] = [];
  getAllHiredCandidates() {
    this.service.getHiredCandidatesData().subscribe((res: any) => {
      this.applicants = res.hiredCandidates;
      this.totalHiredCandidates = res.totalHiredCandidates;
    });
  }
}
