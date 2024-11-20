import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionData } from '../../models/jobModel';

@Injectable({
  providedIn: 'root',
})
export class TestServiceService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual URL

  constructor(private http: HttpClient) {}

  generateTestQuestion(formdata: object): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate_questions`, formdata);
  }
  fetchGeneratedQuestions(generatedQuestion_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/${generatedQuestion_id}`);
  }
  getAllGeneratedQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generated_questions/getAllQuestions`);
  }
  deleteGeneratedQuestion(questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/generated_questions/${questionId}`);
  }

  getActiveJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/active`);
  }

  deleteGeneratedForm(formsId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/test-forms/${formsId}`);
  }

  getAllGeneratedForms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/generated/forms/getAllforms`);
  }

  createTestForm(
    job_id: string,
    generatedQuestionId: string,
    testData: {
      title: string;
      questions: any[];
      duration: number;
    }
  ): Observable<any> {
    const url = `${this.apiUrl}/create_test_form/${generatedQuestionId}/${job_id}`;
    return this.http.post(url, testData, {
      withCredentials: true,
    });
  }

  getTestForm(formId: string, token: string): Observable<any> {
    const params = new HttpParams().set('token', token); // Create query parameters
    return this.http.get(`${this.apiUrl}/forms/${formId}`, { params }); // Include params in the request
  }
  getTestFormForAdmin(formId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forms/admin/${formId}`); // Include params in the request
  }
  updateTest(
    testId: string,
    testData: { title: string; questions: any[]; duration: number }
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update_test_form/${testId}`,
      testData,
      {
        withCredentials: true,
      }
    );
  }
  deleteQuestion(testId: string, questionIndex: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/tests/${testId}/questions/${questionIndex}`
    );
  }

  submitTest(formId: string, submissionData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/forms/submitTest/${formId}`,
      submissionData
    );
  }
  getApplicantsByFormId(
    formId: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/applied-test-applicants-list/${formId}?page=${page}&limit=${limit}`
    );
  }
  deleteApplicant(applicantId: string) {
    return this.http.delete(
      `${this.apiUrl}/applied-Test-applicants-delete/${applicantId}`
    );
  }
  updateForm(formId: string, updateData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/exit-interview-update/${formId}`,
      updateData
    );
  }
  // In test-service.service.ts
  getEvalutionOfApplicants(
    formId: string,
    applicantId: string
  ): Observable<SubmissionData> {
    return this.http.get<SubmissionData>(
      `${this.apiUrl}/view/answers/${formId}/${applicantId}`
    );
  }
}
