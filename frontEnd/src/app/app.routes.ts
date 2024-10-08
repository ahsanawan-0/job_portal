import { Routes } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { MainSectionComponent } from './Components/main-section/main-section.component';
import { TestComponent } from './Components/test/test.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
    ],
  },
];
