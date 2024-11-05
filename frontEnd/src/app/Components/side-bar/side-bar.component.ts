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

  selectOverview() {
    this.isOverviewSelected = true;
    this.isMyJobsSelected = false;
    this.isExitInterviewSelected = false;
  }

  selectMyJobs() {
    this.isMyJobsSelected = true;
    this.isOverviewSelected = false;
    this.isExitInterviewSelected = false;
  }

  selectExitInterview() {
    this.isExitInterviewSelected = true;
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
