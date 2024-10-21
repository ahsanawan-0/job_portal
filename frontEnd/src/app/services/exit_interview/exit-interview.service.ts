import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExitInterviewService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with actual URL

  constructor(private http: HttpClient) {}

  // Create form
  createForm(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, formData);
  }

  // Get form by ID
  getForm(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Submit form responses
  submitForm(responses: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, responses);
  }
}
