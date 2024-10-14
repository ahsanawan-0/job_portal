import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ApplicationCardComponent } from '../application-card/application-card.component';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, ApplicationCardComponent],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.css',
})
export class JobApplicationsComponent {
  isDropdownVisible = signal(false);

  toggleDropdown() {
    this.isDropdownVisible.update((prev) => !prev);
  }

  // dropdown: boolean = false;
  // onClickThreeDots() {
  //   this.dropdown = !this.dropdown;
  // }

  dropdown: { [key: number]: boolean } = {};
  onClickThreeDots(index: number) {
    this.dropdown[index] = !this.dropdown[index];
  }
}
