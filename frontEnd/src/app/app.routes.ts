import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ExitInterviewFormViewerComponent } from './Components/exit-interview-form-viewer-component/exit-interview-form-viewer-component.component';
import { JobViewPageComponent } from './pages/job-view-page/job-view-page.component';
import { TestViewPageComponent } from './pages/test-view-page/test-view-page.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobApplicationsComponent } from './Components/job-applications/job-applications.component';
import { MyJobsComponent } from './Components/my-jobs/my-jobs.component';
import { ExitInterviewComponent } from './Components/exit-interview/exit-interview.component';
import { TechnicalInterviewComponent } from './pages/technical-interview/technical-interview.component';
import { ExitInterviewResultComponent } from './Components/exit-interview-result/exit-interview-result.component';
import { ExitInterviewFormComponent } from './Components/exit-interview-form/exit-interview-form.component';
import { FormComponent } from './pages/create_job/form.component';
import { CreateTestComponent } from './pages/create-test-questions/create-test.component';
import { TestComponent } from './Components/test/test.component';
import { QuestionCardComponent } from './Components/question-card/question-card.component';
import { CreateTestFormComponent } from './pages/create-test-form/create-test-form.component';
import { GeneratedQuestionsViewComponent } from './pages/generated-questions-view/generated-questions-view.component';
import { TestFormResultsComponent } from './Components/test-form-results/test-form-results.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { LoaderComponent } from './Components/loader/loader.component';
import { ApplicantTestSubmissionsComponent } from './Components/applicant-test-submisions/applicant-test-submissions.component';
import { ExitApplicantInfoComponent } from './Components/exit-applicant-info/exit-applicant-info.component';
import { ExitFormAdminViewComponent } from './Components/exit-form-admin-view/exit-form-admin-view.component';
import { authGuard } from './services/authGuard/guards/auth.guard';
import { NotFoundComponentComponent } from './Components/not-found-component/not-found-component.component';
import { HiredCandidateComponent } from './Components/hired-candidate/hired-candidate.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { loginRedirectGuardGuard } from './services/loginRedirectedGuard/login-redirect-guard.guard';
import { ReviewFormComponent } from './Components/review-form/review-form.component';
import { DynamicCreateFormComponent } from './Components/dynamic-create-form/dynamic-create-form.component';
import { ReviewFormAdminViewComponent } from './Components/review-form-admin-view/review-form-admin-view.component';
import { ReviewFormViewComponent } from './Components/review-form-view/review-form-view.component';
import { ReviewFormResultComponent } from './Components/review-form-result/review-form-result.component';
import { ReviewFormAnswersComponent } from './Components/review-form-answers/review-form-answers.component';
import { TestEditPageComponent } from "./Components/test-edit-page/test-edit-page.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginRedirectGuardGuard],
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
    path: 'test/admin/:testId',
    component: TestViewPageComponent,
  },
  {
    path: 'test/user/:testId',
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
        path: 'questionCard',
        component: QuestionCardComponent,
      },
      {
        path: 'exitInterviewViewForm/:uniqueLinkId',
        component: ExitInterviewFormViewerComponent,
      },
      {
        path: 'questionform/:generatedQuestions_id/:job_id',
        component: CreateTestFormComponent,
      },

      { path: 'edit-test/:formId', component: TestEditPageComponent }, // Route for editing a test

      {
        path: 'viewQuestions/:generatedQuestions_id',
        component: GeneratedQuestionsViewComponent,
      },
      {
        path: 'test-applicants-list/:formId',
        component: TestFormResultsComponent,
      },
{
    path: 'applicant-test-submission/:submissionId/:applicantId',
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
      {
        path: 'reviewForm',
        component: ReviewFormComponent,
      },
      {
        path: 'reviewForm/create',
        component: DynamicCreateFormComponent,
      },
      {
        path: 'reviewFormAdminView/:uniqueLinkId',
        component: ReviewFormAdminViewComponent,
      },
      {
        path: 'reviewFormResults/:uniqueLinkId',
        component: ReviewFormResultComponent,
      },
      {
        path: 'reviewFormAnswers/:applicantId',
        component: ReviewFormAnswersComponent,
      },
      { path: 'update-job/:jodId', component: FormComponent },
      { path: 'repost-job/:jodId', component: FormComponent },
    ],
    
  },
  {
    path: 'test',
    component: TestComponent,
    canActivate: [authGuard],
  },

  {
    path: 'reviewFormViewer/:uniqueLinkId',
    component: ReviewFormViewComponent,
    canActivate: [authGuard],
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
    path: '**',
    component: NotFoundComponentComponent,
  },
];
