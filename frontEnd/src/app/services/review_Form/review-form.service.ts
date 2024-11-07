import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewFormService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  getAllReviewForms() {
    return this.http.get(`${this.apiUrl}/reviewForm/getAllForms`);
  }

  deleteReviewForm(uniqueLinkId: string) {
    return this.http.delete(`${this.apiUrl}/reviewForm/delete/${uniqueLinkId}`);
  }

  getFormbyId(uniqueLinkId: string) {
    return this.http.get(`${this.apiUrl}/reviewForm/byId/${uniqueLinkId}`);
  }

  createReviewForm(form: any) {
    return this.http.post(`${this.apiUrl}/reviewForm/create`, form);
  }
}
