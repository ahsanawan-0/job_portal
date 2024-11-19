// src/services/job-application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Applicant,
  ApplicantsResponse,
  ShortApplicantsResponse,
  TestInvitedApplicants,
} from '../../models/jobModel';

@Injectable({
  providedIn: 'root', // Ensures the service is available application-wide
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Submit Job Application using FormData
  getApplication(formData: FormData, jobId: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/submit-application/${jobId}`, formData, {
        withCredentials: true, // Include credentials if needed
      })
      .pipe(
        catchError((error) => {
          console.error('Error submitting application:', error);
          return throwError(error); // Propagate the error
        })
      );
  }

  // Additional methods can remain unchanged
  getAllApplications() {
    return this.http.get(`${this.apiUrl}/getAllApplications`);
  }
  getFileById(resumeId: string) {
    return this.http.get(`${this.apiUrl}/file/${resumeId}`);
  }

  getApplicantsForJob(jobId: string | null): Observable<ApplicantsResponse> {
    // Make sure to adjust the endpoint according to your API
    return this.http.get<ApplicantsResponse>(
      `${this.apiUrl}/getApplicantsForJob/${jobId}`
    );
  }

  createShortlistedApplicant(jobId: string | null, applicantId: string) {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/shortlist`, {
      applicantId,
    });
  }

  getAllTestInvitedApplicants(
    jobId: string | null
  ): Observable<TestInvitedApplicants> {
    return this.http.get<TestInvitedApplicants>(
      `${this.apiUrl}/getAllTestInvitedApplicants/${jobId}`
    );
  }

  getAllShortListedApplicants(
    jobId: string | null
  ): Observable<ShortApplicantsResponse> {
    return this.http.get<ShortApplicantsResponse>(
      `${this.apiUrl}/getAllShortListedApplicants/${jobId}`
    );
  }

  createTestInvitedApplicantsForJob(
    jobId: string | null,
    applicantId: string,
    testId: string
  ) {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/testInvite`, {
      applicantId,
      testId,
    });
  }

  createHiredApplicantsForJob(jobId: string | null, applicantId: string) {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/hiredApplicant`, {
      applicantId,
    });
  }

  getAllHiredApplicants(jobId: string | null) {
    return this.http.get(`${this.apiUrl}/getAllHiredApplicants/${jobId}`);
  }

  deleteApplication(applicationId: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/applications/${applicationId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting application:', error);
          return throwError(error);
        })
      );
  }

  getHiredCandidatesData() {
    return this.http.get(`${this.apiUrl}/jobs/hired-candidates`);
  }
  getTestsForJob(jobId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tests/${jobId}`);
  }
  getApplicantById(applicantId: string): Observable<any> {
    // Set the query parameters
    const params = new HttpParams().set('applicant', applicantId);

    // Make the GET request with query parameters
    return this.http.get<any>(`${this.apiUrl}/applicant`, { params });
  }

  createOnSiteInviteForJob(
    jobId: string | null,
    applicantId: string,
    interviewDetails: { date: string; time: string }
  ) {
    const body = { applicantId, ...interviewDetails };
    console.log('in service', body);
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/onsiteInvite`, {
      body,
    });
  }

  getOnsiteInviteApplicants(jobId: string | null) {
    return this.http.get(`${this.apiUrl}/getAllOnsiteApplicants/${jobId}`);
  }
}
