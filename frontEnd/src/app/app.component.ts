import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobDetailComponent } from '../pages/job-detail/job-detail.component';
// import { ApplyJobModalComponent } from '../Components/apply-job-modal/apply-job-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,JobDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'job-portal';
}
