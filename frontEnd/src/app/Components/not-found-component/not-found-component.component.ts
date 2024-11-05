import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found-component.component.html',
  styleUrl: './not-found-component.component.css',
})
export class NotFoundComponentComponent implements OnInit {
  service = inject(AuthService);
  router = inject(Router);
  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.service.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      },
      (error) => {
        console.error('Error checking authentication status', error);
        this.isLoggedIn = false; // Default to not logged in if there's an error
      }
    );
  }

  navigateToClient(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
