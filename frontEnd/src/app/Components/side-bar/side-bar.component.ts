import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  isOverviewSelected: boolean = false;
  isMyJobsSelected: boolean = false;
  isExitInterviewSelected: boolean = false;
  isTechnicalInterviewSelected: boolean = false;

  selectOverview() {
    this.isOverviewSelected = true;
    this.isMyJobsSelected = false;
    this.isExitInterviewSelected = false;
    this.isTechnicalInterviewSelected = false;
  }

  selectMyJobs() {
    this.isMyJobsSelected = true;
    this.isOverviewSelected = false;
    this.isExitInterviewSelected = false;
    this.isTechnicalInterviewSelected = false;
  }

  selectExitInterview() {
    this.isExitInterviewSelected = true;
    this.isMyJobsSelected = false;
    this.isTechnicalInterviewSelected = false;
    this.isOverviewSelected = false;
  }
  selectTechnicalInterview() {
    this.isExitInterviewSelected = false;
    this.isMyJobsSelected = false;
    this.isTechnicalInterviewSelected = true;
    this.isOverviewSelected = false;
  }
}
