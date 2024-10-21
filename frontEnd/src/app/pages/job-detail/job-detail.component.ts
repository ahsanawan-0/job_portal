import { Component, inject, OnInit } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { SharedModule } from '../../sharedModules/shared.module';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Job } from '../../models/jobModel'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ApplyJobModalComponent, SharedModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
})
export class JobDetailComponent implements OnInit {
  private modalService = inject(NgbModal);
  private createJobService = inject(CreateJobService);

  job: any; // To store job details
  jobId: string = '67163ee7315023eb076dcf73'; // Replace with actual job ID
  searchQuery: string = ''; // For search input binding
  showDropdown: boolean = false; // To toggle the predictive search results
  searchResults: Job[] = []; // Store search results using the Job interface
  loading: boolean = false; // To show the loading spinner
  searchSubject = new Subject<string>(); // To handle debounced search

  ngOnInit() {
    this.getJobDetails();

    // Handle debounced search input
    this.searchSubject.pipe(
      debounceTime(800), // Wait for 300ms pause in events
      distinctUntilChanged() // Only emit if value has changed
    ).subscribe(query => {
      if (query) {
        this.loading = true;
        this.performSearch(query);
      } else {
        this.showDropdown = false;
      }
    });
  }

  getJobDetails() {
    this.createJobService.getJobById(this.jobId)
      .subscribe(
        (data) => {
          console.log('API Response:', data);
          this.job = data.job;
        },
        (error) => {
          console.error('Error fetching job details:', error);
        }
      );
  }

  openApplyModal() {
    const modalRef = this.modalService.open(ApplyJobModalComponent);
  }

  // Triggered on input change in search bar
  onSearch() {
    // Emit value to trigger debounced search
    this.searchSubject.next(this.searchQuery);
    console.log("Search query:", this.searchQuery); // Debugging line

  }

  // Function to perform the search and fetch results
  performSearch(query: string) {
    // Simulate API call for searching
    this.createJobService.searchJobs(query).subscribe(
      (response) => {
        this.searchResults = response.jobs;
console.log("search results",this.searchResults)
        this.loading = false; // Hide loading spinner
        this.showDropdown = true; // Show dropdown with results
      },
      (error) => {
        console.error('Error fetching search results:', error);
        this.loading = false;
      }
    );
  }

  // Handle viewing the search result
  viewResult(id: string) {
    // Add navigation or modal opening logic here
  }
}
