import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateJobService } from '../../services/create_job/create-job.service';
import { PostJob } from '../../models/jobModel';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [ReactiveFormsModule, CommonModule,NgxEditorModule],
  standalone: true,
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  jobId: string | null = null; // Job ID from route
  mode: 'create' | 'update' | 'repost' = 'create'; // Mode of the component
  job: PostJob | null = null; // Job data for update/repost
  jobForm: FormGroup; // Reactive form group
  descriptionEditor!: Editor; // Separate editor for description
  responsibilitiesEditor!: Editor; // Separate editor for responsibilities
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    ['text_color', 'background_color'],
  ];
  // Feedback messages
  successMessage: string = '';
  errorMessage: string = '';
  today: string;
  isPosting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private createJobService: CreateJobService,
    private router: Router,
    private notification: NotificationService,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize today date
    const now = new Date();
    this.today = now.toISOString().slice(0, 16);

    // Initialize the reactive form
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      tags: ['', Validators.required],
      location: ['', Validators.required],
      minSalary: [null, Validators.required],
      maxSalary: [null, Validators.required],
      education: ['', Validators.required],
      experience: ['', Validators.required],
      jobType: ['', Validators.required],
      vacancies: [null, Validators.required],
      expirationDate: ['', Validators.required],
      description: ['', Validators.required],
      responsibilities: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.jobId = this.route.snapshot.paramMap.get('jodId'); 
    if (this.jobId) {
      this.loadJobDetails(); 
      this.mode = this.route.snapshot.routeConfig?.path?.includes('update-job') ? 'update' : 'repost'; 
    } else {
      this.mode = 'create'; // Set mode to create
    }
    this.descriptionEditor = new Editor();
    this.responsibilitiesEditor = new Editor();
  }

  loadJobDetails() {
    this.createJobService.getJobById(this.jobId).subscribe({
      next: (data) => {
        this.job = data.job;
        this.populateForm(this.job);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  populateForm(job: PostJob) {
    this.jobForm.patchValue({
      jobTitle: job.jobTitle,
      tags: job.tags.join(', '),
      location: job.location,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      education: job.education,
      experience: job.experience,
      jobType: job.jobType,
      vacancies: job.vacancies,
      expirationDate: job.expirationDate,
      description: job.description,
      responsibilities: job.responsibilities,
    });
      if (this.mode === 'repost') {
        this.jobForm.get('expirationDate')!.setValue(''); 
        this.jobForm.get('expirationDate')!.setValidators([Validators.required]);
      } else {
        this.jobForm.patchValue({ expirationDate: job.expirationDate });
      }
  }

  submitForm() {
    if (this.mode === 'repost' && !this.jobForm.value.expirationDate) {
      this.errorMessage = 'A new expiration date is required when reposting the job.';
      return;
    }
  
    if (this.jobForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    this.isPosting = true;
    const jobData: PostJob = this.prepareJobData();
  
    if (this.mode === 'update') {
      this.updateJob(jobData);
    } else {
      this.createOrRepostJob(jobData);
    }
  }

  createOrRepostJob(jobData: PostJob) {
    this.createJobService.postJob(jobData).subscribe({
      next: (response) => {
        this.isPosting = false;
        this.notification.showSuccess(this.mode === 'repost' ? 'Job reposted successfully' : 'Job posted successfully');
        this.resetFields();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.isPosting = false;
      }
    });
  }

  updateJob(jobData: PostJob) {
    this.createJobService.updateJob(this.jobId, jobData).subscribe({
      next: (response) => {
        this.notification.showSuccess('Job updated successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.handleError(error);
      },
      complete: () => {
        this.isPosting = false;
      }
    });
  }

  prepareJobData(): PostJob {
    return {
      jobTitle: this.jobForm.value.jobTitle,
      tags: this.jobForm.value.tags.split(',').map((tag: string) => tag.trim()), // Explicitly specify type here
      location: this.jobForm.value.location,
      minSalary: this.jobForm.value.minSalary,
      maxSalary: this.jobForm.value.maxSalary,
      education: this.jobForm.value.education,
      experience: this.jobForm.value.experience,
      jobType: this.jobForm.value.jobType,
      vacancies: this.jobForm.value.vacancies,
      expirationDate: this.jobForm.value.expirationDate,
      description: this.jobForm.value.description, // Get content from child component
      responsibilities: this.jobForm.value.responsibilities, // Get content from child component
    };
  }
  handleError(error: any) {
    this.errorMessage = error.error.message || 'Error processing the job.';
    this.successMessage = '';
  }

  resetFields(): void {
    this.jobForm.reset();
  }
}