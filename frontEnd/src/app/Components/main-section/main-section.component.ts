import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.css',
})
export class MainSectionComponent {
  dropdown: boolean = false;
  onClickThreeDots() {
    this.dropdown = !this.dropdown;
  }
}
