import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-card-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card-component.component.html',
  styleUrl: './job-card-component.component.css',
})
export class JobCardComponentComponent {
  // dropdown: boolean = false;
  // onClickThreeDots() {
  //   this.dropdown = !this.dropdown;
  //   console.log(this.dropdown);
  // }
  @Input() jobs: any = 0;
  dropdownIndex: number | null = null;
  onClickThreeDots(index: number) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  }
}
