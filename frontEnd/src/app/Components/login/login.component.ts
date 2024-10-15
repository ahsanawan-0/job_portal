import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
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
}
