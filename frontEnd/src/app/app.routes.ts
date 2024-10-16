import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { MainSectionComponent } from './Components/main-section/main-section.component';
import { TestComponent } from './Components/test/test.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobApplicationsComponent } from './Components/job-applications/job-applications.component';
import { MyJobsComponent } from './Components/my-jobs/my-jobs.component';
import { ExitInterviewComponent } from './Components/exit-interview/exit-interview.component';
import { ExitInterviewResultComponent } from './Components/exit-interview-result/exit-interview-result.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { LoginComponent } from './Components/login/login.component';
import { ExitInterviewFormComponent } from './Components/exit-interview-form/exit-interview-form.component';
import { FormComponent } from './pages/create_job/form.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'job-applications',
        component: JobApplicationsComponent,
      },
      {
        path: 'myjobs',
        component: MyJobsComponent,
      },
      {
        path: 'exitinterview',
        component: ExitInterviewComponent,
      },
      {
        path: 'exitInterviewResult',
        component: ExitInterviewResultComponent,
      },
      {
        path: 'exitInterviewForm',
        component: ExitInterviewFormComponent,
      },
      {
        path: 'createJobPost',
        component: FormComponent,
      },

      {
        path: 'test',
        component: TestComponent,
      },
    ],
  },

  {
    path: 'loader',
    component: LoaderComponent,
  },
  {
    path: 'jobDetail',
    component: JobDetailComponent,
  },
];
