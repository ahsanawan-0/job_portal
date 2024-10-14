import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exit-interview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exit-interview.component.html',
  styleUrl: './exit-interview.component.css',
})
export class ExitInterviewComponent {
  route = inject(Router);
  onClickViewResults() {
    this.route.navigateByUrl('exitInterviewResult');
  }
}
