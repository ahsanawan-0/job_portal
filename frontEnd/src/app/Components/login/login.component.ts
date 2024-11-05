import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgetPasswordComponent } from '../../modals/forget-password/forget-password.component';

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
  notification = inject(NotificationService);
  route = inject(Router);
  modalService = inject(NgbModal);

  openForgetPasswordModal() {
    const modalRef = this.modalService.open(ForgetPasswordComponent, {
      centered: true,
      backdrop: 'static',
    });

    // Handle when the password reset is confirmed
    modalRef.componentInstance.resetConfirmed.subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.notification.showSuccess('Password reset successfully!'); // Notify the user
        }
      }
    );
  }

  onSignUp() {
    this.service
      .signUp(this.name, this.designation, this.email, this.password)
      .subscribe(
        (response: any) => {
          this.message = response.message;
          this.notification.showSuccess(response.message);

          this.isSignIn = true;
        },
        (error) => {
          this.notification.showError(error.error.message);
          this.message = error.error.message;
        }
      );
  }

  onSignIn() {
    this.service.signIn(this.email, this.password).subscribe(
      (response: any) => {
        this.message = response.message; // Success message
        this.notification.showSuccess(`${this.email} signed in successfully`);
        this.route.navigate(['/dashboard']); // Adjust path as needed
      },
      (error) => {
        // this.message = error.error.message;
        this.notification.showError(error.error.message);
      }
    );
  }
}
