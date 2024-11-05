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
import { ExitInterviewFormViewerComponent } from './Components/exit-interview-form-viewer-component/exit-interview-form-viewer-component.component';
import { JobViewPageComponent } from './pages/job-view-page/job-view-page.component';
import { ExitApplicantInfoComponent } from './Components/exit-applicant-info/exit-applicant-info.component';
import { ExitInterviewFormDetailComponent } from './Components/exit-interview-form-detail/exit-interview-form-detail.component';
import { ExitFormAdminViewComponent } from './Components/exit-form-admin-view/exit-form-admin-view.component';
import { authGuard } from './services/authGuard/guards/auth.guard';
import { NotFoundComponentComponent } from './Components/not-found-component/not-found-component.component';
import { HiredCandidateComponent } from './Components/hired-candidate/hired-candidate.component';

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
    path: 'exitInterviewViewForm/:id',
    component: ExitInterviewFormViewerComponent,
  },
  {
    path: 'jobdetail/user/:id',
    component: JobViewPageComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'job-applications/:id',
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
        path: 'exitInterviewResult/:uniqueLinkId',
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
      {
        path: 'exitInterviewViewForm/:uniqueLinkId',
        component: ExitInterviewFormViewerComponent,
      },
      {
        path: 'exitApplicantInfo/:applicantId',
        component: ExitApplicantInfoComponent,
      },
      {
        path: 'exitFormdetail/admin/:uniqueLinkId',
        component: ExitInterviewFormDetailComponent,
      },
      {
        path: 'exitFormdetail/adminView/:uniqueLinkId',
        component: ExitFormAdminViewComponent,
      },
      {
        path: 'hiredCandidate',
        component: HiredCandidateComponent,
      },
    ],
  },

  {
    path: 'jobdetail/admin/:id',
    component: JobDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'loader',
    component: LoaderComponent,
  },
  {
    path: '**', // This wildcard route matches any path that doesn't exist
    component: NotFoundComponentComponent, // Render the NotFoundComponent
  },
];
