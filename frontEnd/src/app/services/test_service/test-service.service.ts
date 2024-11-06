import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  
  deleteGeneratedForms(formsId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/generated_forms/${formsId}`);
  }
  getAllGeneratedForms(): Observable<any> {
    return this.http.get(`${this.apiUrl}//generated/forms/getAllforms`);
  }

  createTest(testData: {
    title: string;
    questions: any[];
    duration: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_test_form`, testData, {
      withCredentials: true,
    });
  }
  getTestForm(formId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forms/${formId}`);
  }
updateTest(testId: string, testData: { title: string; questions: any[]; duration: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_test_form/${testId}`, testData, {
      withCredentials: true,
    });
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
  getApplicantsSubmissions(submissionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/submisions/results/${submissionId}`);
  }
}
