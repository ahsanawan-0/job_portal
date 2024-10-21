// src/services/job-application.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // Ensures the service is available application-wide
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Submit Job Application using FormData
  getApplication(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-application`, formData, {
      withCredentials: true, // Include credentials if needed
    }).pipe(
      catchError((error) => {
        console.error('Error submitting application:', error);
        return throwError(error); // Propagate the error
      })
    );
  }

  // Additional methods can remain unchanged
  getApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications`, {
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        console.error('Error fetching applications:', error);
        return throwError(error);
      })
    );
  }

  deleteApplication(applicationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/applications/${applicationId}`, {
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        console.error('Error deleting application:', error);
        return throwError(error);
      })
    );
  }
}