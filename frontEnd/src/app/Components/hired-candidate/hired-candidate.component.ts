import { Component, inject, OnInit } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';

@Component({
  selector: 'app-hired-candidate',
  standalone: true,
  imports: [],
  templateUrl: './hired-candidate.component.html',
  styleUrl: './hired-candidate.component.css',
})
export class HiredCandidateComponent implements OnInit {
  service = inject(JobApplicationService);

  ngOnInit(): void {
    this.getAllHiredCandidates();
  }

  applicants: any[] = [];
  getAllHiredCandidates() {
    this.service.getHiredCandidatesData().subscribe((res: any) => {
      this.applicants = res.hiredCandidates;
    });
  }
}
