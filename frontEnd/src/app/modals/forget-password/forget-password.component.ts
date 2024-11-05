import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  @Output() resetConfirmed = new EventEmitter<boolean>();
  notification = inject(NotificationService);

  passwordResetForm: FormGroup;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService // Inject the AuthService
  ) {
    this.passwordResetForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: ['', [Validators.required, Validators.minLength(10)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordsMatch }
    );
  }

  passwordsMatch(formGroup: FormGroup) {
    return formGroup.get('newPassword')?.value ===
      formGroup.get('confirmPassword')?.value
      ? null
      : { notMatching: true };
  }

  confirmReset() {
    if (this.passwordResetForm.valid) {
      const { email, newPassword, confirmPassword } =
        this.passwordResetForm.value;

      // Call the AuthService to reset the password with all three parameters
      this.authService
        .resetPassword(email, newPassword, confirmPassword)
        .subscribe(
          (response) => {
            // Handle success response
            this.resetConfirmed.emit(true); // Emit success
            this.activeModal.close();
          },
          (error) => {
            const errorMessage =
              error.error?.message || 'An unexpected error occurred.';
            this.notification.showError(errorMessage);
          }
        );
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
