import { Routes } from "@angular/router";
import { LoginComponent } from "./Components/login/login.component";
import { ExitInterviewFormViewerComponent } from "./Components/exit-interview-form-viewer-component/exit-interview-form-viewer-component.component";
import { JobViewPageComponent } from "./pages/job-view-page/job-view-page.component";
import { TestViewPageComponent } from "./pages/test-view-page/test-view-page.component";
import { LayoutComponent } from "./Components/layout/layout.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { JobApplicationsComponent } from "./Components/job-applications/job-applications.component";
import { MyJobsComponent } from "./Components/my-jobs/my-jobs.component";
import { ExitInterviewComponent } from "./Components/exit-interview/exit-interview.component";
import { TechnicalInterviewComponent } from "./pages/technical-interview/technical-interview.component";
import { ExitInterviewResultComponent } from "./Components/exit-interview-result/exit-interview-result.component";
import { ExitInterviewFormComponent } from "./Components/exit-interview-form/exit-interview-form.component";
import { FormComponent } from "./pages/create_job/form.component";
import { CreateTestComponent } from "./pages/create-test-questions/create-test.component";
import { TestComponent } from "./Components/test/test.component";
import { QuestionCardComponent } from "./Components/question-card/question-card.component";
import { CreateTestFormComponent } from "./pages/create-test-form/create-test-form.component";
import { GeneratedQuestionsViewComponent } from "./pages/generated-questions-view/generated-questions-view.component";
import { TestFormResultsComponent } from "./Components/test-form-results/test-form-results.component";
import { JobDetailComponent } from "./pages/job-detail/job-detail.component";
import { LoaderComponent } from "./Components/loader/loader.component";
import { ApplicantTestSubmissionsComponent } from "./Components/applicant-test-submisions/applicant-test-submissions.component";
import { ExitApplicantInfoComponent } from './Components/exit-applicant-info/exit-applicant-info.component';
import { ExitFormAdminViewComponent } from './Components/exit-form-admin-view/exit-form-admin-view.component';
import { authGuard } from './services/authGuard/guards/auth.guard';
import { NotFoundComponentComponent } from './Components/not-found-component/not-found-component.component';
import { HiredCandidateComponent } from './Components/hired-candidate/hired-candidate.component';
import { SettingsComponent } from './Components/settings/settings.component';

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
    path: 'test/user/:id',
    component: TestViewPageComponent,
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
        path: 'technicalinterview',
        component: TechnicalInterviewComponent,
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
        path: 'createTestQuestions',
        component: CreateTestComponent,
      },

      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'questionCard',
        component: QuestionCardComponent,
      },
      {
        path: 'exitInterviewViewForm/:uniqueLinkId',
        component: ExitInterviewFormViewerComponent,
      },
      {
        path: 'questionform/:question_id',
        component: CreateTestFormComponent,
      },
      {
        path: 'viewQuestions/:question_id',
        component: GeneratedQuestionsViewComponent,
      },
      {
        path: 'test-applicants-list/:formId',
        component: TestFormResultsComponent,
      },
      {
        path: 'applicant-test-submission/:submissionId',
        component: ApplicantTestSubmissionsComponent,
      },
      {
        path: 'exitApplicantInfo/:applicantId',
        component: ExitApplicantInfoComponent,
      },

      {
        path: 'exitFormdetail/adminView/:uniqueLinkId',
        component: ExitFormAdminViewComponent,
      },
      {
        path: 'hiredCandidate',
        component: HiredCandidateComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
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
