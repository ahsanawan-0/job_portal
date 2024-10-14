import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [UpperCasePipe, CommonModule, PaginationComponent],
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css',
})
export class MyJobsComponent {
  route = inject(Router);
  dropdown: boolean = false;
  onClickThreeDots() {
    this.dropdown = !this.dropdown;
  }

  onClickViewApplication() {
    this.route.navigateByUrl('job-applications');
  }
}
