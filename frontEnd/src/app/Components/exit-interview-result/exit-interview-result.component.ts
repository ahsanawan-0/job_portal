import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-exit-interview-result',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './exit-interview-result.component.html',
  styleUrl: './exit-interview-result.component.css',
})
export class ExitInterviewResultComponent {
  results = Array.from({ length: 10 }, (_, i) => i + 1);
  itemsPerPage = 7;
  currentPage = 1;
  paginatedResults: number[] = [];

  constructor() {
    this.updatePaginatedJobs();
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedJobs();
  }

  updatePaginatedJobs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.results.slice(startIndex, endIndex);
  }
}
