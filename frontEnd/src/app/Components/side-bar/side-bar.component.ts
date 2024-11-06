import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';

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
  isHiredCandidateSelected: boolean = false;
  isSettingsSelected: boolean = false;
  isTechnicalInterviewSelected: boolean = false;

  selectOverview() {
    this.isOverviewSelected = true;
    this.isMyJobsSelected = false;
    this.isExitInterviewSelected = false;
    this.isHiredCandidateSelected = false;
    this.isSettingsSelected = false;
    this.isTechnicalInterviewSelected = false;
  }

  selectMyJobs() {
    this.isMyJobsSelected = true;
    this.isOverviewSelected = false;
    this.isExitInterviewSelected = false;
    this.isHiredCandidateSelected = false;
    this.isSettingsSelected = false;
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
    this.isHiredCandidateSelected = false;
    this.isSettingsSelected = false;
  }

  selectHiredCandidate() {
    this.isHiredCandidateSelected = true;
    this.isExitInterviewSelected = false;
    this.isMyJobsSelected = false;
    this.isOverviewSelected = false;
    this.isSettingsSelected = false;
  }

  selectSettings() {
    this.isSettingsSelected = true;
    this.isHiredCandidateSelected = false;
    this.isExitInterviewSelected = false;
    this.isMyJobsSelected = false;
    this.isOverviewSelected = false;
  }

  route = inject(Router);
  notifictaion = inject(NotificationService);
  service = inject(AuthService);
  logout() {
    this.service.logout().subscribe(
      (response: any) => {
        console.log(response.message);
        this.notifictaion.showSuccess(response.message);
        this.route.navigate(['/login']);
      },
      (error) => {
        this.notifictaion.showError(`Logout failed: ${error}`);
        console.error('Logout failed:', error);
      }
    );
  }
}
