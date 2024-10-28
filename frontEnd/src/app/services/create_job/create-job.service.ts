// src/services/create-job.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiPostModel, JobResponse, PostJob } from '../../models/jobModel';

@Injectable({
  providedIn: 'root', // Ensures the service is available application-wide
})
export class CreateJobService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  postJob(jobData: PostJob): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/create-job`, jobData)
      .pipe(catchError(this.handleError));
  }

  // Method to get all jobs
  getAllJobsForCount(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/jobs/alljobsforcount`)
      .pipe(catchError(this.handleError));
  }

  getAllJobs(
    page: number,
    limit: number = 4
  ): Observable<{ simplifiedJobs: any[]; totalJobs: number }> {
    return this.http
      .get<{ simplifiedJobs: any[]; totalJobs: number }>(
        `${this.apiUrl}/jobs/alljobs?page=${page}&limit=${limit}`
      )
      .pipe(catchError(this.handleError));
  }

  getAllRecentJobs(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/jobs/recentJobs`)
      .pipe(catchError(this.handleError));
  }

  updateJobStatus(jobId: string, status: string): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/jobs/${jobId}/status`, { status })
      .pipe(catchError(this.handleError));
  }

  // Method to get a job by ID
  getJobById(jobId: string): Observable<ApiPostModel> {
    return this.http
      .get<ApiPostModel>(`${this.apiUrl}/getSignleJob/${jobId}`)
      .pipe(catchError(this.handleError));
  }
  searchJobs(keyword: string): Observable<JobResponse> {
    // Encode the keyword for safe URL transmission
    const encodedKeyword = encodeURIComponent(keyword);

    return this.http.get<JobResponse>(
      `${this.apiUrl}/jobs/search?keyword=${encodedKeyword}`
    );
  }

  // Method to update a job
  updateJob(jobId: string, jobData: PostJob): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/jobs/${jobId}`, jobData)
      .pipe(catchError(this.handleError));
  }

  // Method to delete a job
  deleteJob(jobId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/jobs/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      errorMessage = `An error occurred: ${error.error.message}`;
      console.log(error.error.message);
    } else {
      // Backend returned unsuccessful response code
      errorMessage = `Server returned code ${error.message}, body was: ${error.message}`;

      console.error(errorMessage);
    }
    return throwError(errorMessage);
  }
}
