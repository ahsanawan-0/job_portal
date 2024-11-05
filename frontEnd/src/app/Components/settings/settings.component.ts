import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  service = inject(AuthService);

  ngOnInit(): void {
    this.getUserData();
  }

  applicant: any[] = [];
  getUserData() {
    this.service.getUserData().subscribe((res: any) => {
      this.applicant = res.user;
      console.log(this.applicant);
    });
  }
}
