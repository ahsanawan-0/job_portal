import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { ExitInterviewModalComponent } from '../modals/exit-interview-modal/exit-interview-modal.component';
import { JobDetailComponent } from '../pages/job-detail/job-detail.component';
import { FormComponent } from '../pages/create_job/form.component';
import { ExitInterviewFormComponent } from '../Components/exit-interview-form/exit-interview-form.component';
// import { ApplyJobModalComponent } from '../Components/apply-job-modal/apply-job-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ExitInterviewFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'job-portal';
}
