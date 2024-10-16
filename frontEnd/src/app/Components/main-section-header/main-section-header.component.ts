import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-section-header',
  standalone: true,
  imports: [],
  templateUrl: './main-section-header.component.html',
  styleUrl: './main-section-header.component.css',
})
export class MainSectionHeaderComponent {
  route = inject(Router);
  onClickPostJob() {
    this.route.navigateByUrl('createJobPost');
  }
}
