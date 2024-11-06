import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private isAuthenticatedCache: boolean | null = null;
  constructor(private http: HttpClient) {}

  signUp(
    name: string,
    designation: string,
    email: string,
    password: string
  ): Observable<any> {
    const userData = { name, designation, email, password };
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  // Method for user login
  signIn(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/signin`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/auth/check`, {
      withCredentials: true,
    });
  }

  resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const body = { email, newPassword, confirmPassword };
    return this.http.post(`${this.apiUrl}/reset-password`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    });
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/userData`, { withCredentials: true });
  }

  updateUserData(updatedUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateUserData`, updatedUser, {
      withCredentials: true,
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, {
      withCredentials: true,
    });
  }

  getAllUsersNotAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notadmin/users`, {
      withCredentials: true,
    });
  }

  deleteUserByEmail(email: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-user`, {
      body: { email },
      withCredentials: true,
    });
  }
}
