import { Component, inject, OnInit } from '@angular/core';
import { ApplyJobModalComponent } from '../../modals/apply-job-modal/apply-job-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { SharedModule } from '../../sharedModules/shared.module';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Job } from '../../models/jobModel'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ApplyJobModalComponent, SharedModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
})
export class JobDetailComponent implements OnInit {
  private createJobService = inject(CreateJobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  job: any; 
    jobId: string = ''; // Initialize without hardcoding
  searchQuery: string = ''; // For search input binding
  showDropdown: boolean = false; // To toggle the predictive search results
  searchResults: Job[] = [];
  loading: boolean = false; // To show the loading spinner
  searchSubject = new Subject<string>(); // To handle debounced search

  ngOnInit() {
    // Get job ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id') || '';
      if (this.jobId) {
        this.getJobDetails();
      }
    });

    // Handle debounced search input
    this.searchSubject.pipe(
      debounceTime(300), // Wait for 300ms pause in events
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

  updateJob() {
    // Logic to navigate to the update job page or open an update modal
    console.log("Navigating to update job for job ID:", this.jobId);
    this.router.navigate(['/update-job', this.jobId])
  }
  
  repostJob() {
    
    this.router.navigate(['/repost-job', this.jobId])
    // You can call a service to repost the job here
 }

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
        console.log("search results", this.searchResults);
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
    // Navigate dynamically to the job details page using the provided ID
    this.router.navigate([`jobdetail/admin/${id}`]);
    this.showDropdown = false; // Show dropdown with results

  }
}
