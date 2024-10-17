import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { JobApplicationService } from '../../services/job_application/job-application.service';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
})
export class MainSectionComponent implements OnInit {
  dropdown: boolean = false;
  onClickThreeDots() {
    this.dropdown = !this.dropdown;
  }

  applications: [] = [];
  service = inject(JobApplicationService);

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications() {
    this.service.getApplications().subscribe((res: any) => {
      this.applications = res;
    });
  }
}
