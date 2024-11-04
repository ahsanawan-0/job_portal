import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  emailPlaceholder: string = 'Email Address';
  passwordPlaceholder: string = 'Password';
  namePlaceholder: string = 'Name';
  designationOption: string = 'HR Manager';
  isSignIn: boolean = true;
  showPassword: boolean = false;
  onClickShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleForm() {
    this.isSignIn = !this.isSignIn;
  }

  name: string = '';
  designation: string = '';
  email: string = '';
  password: string = '';

  message: string = '';

  service = inject(AuthService);
  route = inject(Router);

  onSignUp() {
    this.service
      .signUp(this.name, this.designation, this.email, this.password)
      .subscribe(
        (response: any) => {
          this.message = response.message;

          this.isSignIn = true;
        },
        (error) => {
          this.message = error.error.message;
        }
      );
  }

  onSignIn() {
    this.service.signIn(this.email, this.password).subscribe(
      (response: any) => {
        this.message = response.message; // Success message
        // Handle successful sign-in (e.g., navigate to dashboard)
        this.route.navigate(['/dashboard']); // Adjust path as needed
      },
      (error) => {
        this.message = error.error.message; // Error message
      }
    );
  }
}
