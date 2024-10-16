import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainSectionComponent } from "../../Components/main-section/main-section.component";
import { MainSectionHeaderComponent } from "../../Components/main-section-header/main-section-header.component";
import { JobOverviewComponent } from "../../Components/job-overview/job-overview.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, MainSectionComponent, MainSectionHeaderComponent, JobOverviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
