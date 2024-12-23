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
  getForm(uniqueLinkId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/exit-interview/${uniqueLinkId}`);
  }

  // Submit form responses
  submitForm(responses: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, responses);
  }

  getAllExitInterviewForms() {
    return this.http.get(`${this.apiUrl}/getAllExitInterviewForms/forms`);
  }

  submitApplicantResponses(
    formId: string,
    applicantData: any
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/exit-interview/${formId}/applicant`,
      applicantData
    );
  }

  submitExitInterview(uniqueLinkId: string, formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/exit-interview-submit/${uniqueLinkId}`,
      formData
    );
  }

  // getApplicantsByFormId(uniqueLinkId: string): Observable<any> {
  //   return this.http.get(
  //     `${this.apiUrl}/exit-interview-applicants/${uniqueLinkId}`
  //   );
  // }
  getApplicantsByFormId(
    uniqueLinkId: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/exit-interview-applicants/${uniqueLinkId}?page=${page}&limit=${limit}`
    );
  }
  getApplicantQuestionsAndAnswers(applicantId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/applicant/${applicantId}/questions-answers`
    );
  }

  deleteFormById(uniqueLinkId: string) {
    return this.http.delete(
      `${this.apiUrl}/exit-interview-delete/${uniqueLinkId}`
    );
  }

  updateForm(uniqueLinkId: string, updateData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/exit-interview-update/${uniqueLinkId}`,
      updateData
    );
  }

  deleteExitApplicant(applicantId: string) {
    return this.http.delete(
      `${this.apiUrl}/exit-interview-applicants-delete/${applicantId}`
    );
  }
}
