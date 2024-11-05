import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-password-reset-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.css'],
})
export class PasswordResetModalComponent {
  @Output() resetConfirmed = new EventEmitter<boolean>();

  passwordResetForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService // Inject the AuthService
  ) {
    this.passwordResetForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
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
            // Handle error response
            console.error('Password reset failed:', error);
            // Optionally show an error message to the user
          }
        );
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
