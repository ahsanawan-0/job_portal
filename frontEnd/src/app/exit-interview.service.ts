import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ExitInterviewForm {
  title: string;
  questions: Question[];
}

interface Question {
  label: string;
  type: string;
  options?: string[]; // Only for radio type questions
}

@Injectable({
  providedIn: 'root'
})
export class ExitInterviewService {
  private formApiUrl = 'https://your-api-endpoint.com/exit-interview-form'; // Replace with your API URL
  private submitApiUrl = 'https://your-api-endpoint.com/submit-exit-interview'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Fetch the form structure
  getForm(): Observable<ExitInterviewForm> {
    return this.http.get<ExitInterviewForm>(this.formApiUrl);
  }

  // Submit the user's responses
  submitForm(responses: any): Observable<any> {
    return this.http.post<any>(this.submitApiUrl, responses);
  }
}
