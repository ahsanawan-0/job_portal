import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent implements OnInit {
  route = inject(Router);
  notifictaion = inject(NotificationService);
  service = inject(AuthService);
  logout() {
    this.service.logout().subscribe(
      (response: any) => {
        this.notifictaion.showSuccess(response.message);
        this.route.navigate(['/login']);
      },
      (error) => {
        this.notifictaion.showError(`Logout failed: ${error}`);
        console.error('Logout failed:', error);
      }
    );
  }
  selectedRoute: string = '';
  sideBarItems = [
    {
      route: '/dashboard',
      label: 'Overview',
      icon: 'assets/icons/GreyStack.svg',
      iconSelected: 'assets/icons/BlueStack.svg',
    },
    {
      route: '/myjobs',
      label: 'My Jobs',
      icon: 'assets/icons/Briefcase.svg',
      iconSelected: 'assets/icons/BriefcaseBlue.svg',
    },
    {
      route: '/hiredCandidate',
      label: 'Hired Candidate',
      icon: 'assets/icons/BookmarkSimple.svg',
      iconSelected: 'assets/icons/BookmarkSimpleBlue.svg',
    },
    {
      route: '/technicalinterview',
      label: 'Technical Interview',
      icon: 'assets/icons/UserCircleGear.svg',
      iconSelected: 'assets/icons/UserCircleGearBlue.svg',
    },
    {
      route: '/exitinterview',
      label: 'Exit Interview',
      icon: 'assets/icons/UserCircleMinus.svg',
      iconSelected: 'assets/icons/UserCircleMinusBlue.svg',
    },
    {
      route: '/reviewForm',
      label: 'Review Form',
      icon: 'assets/icons/Note.svg',
      iconSelected: 'assets/icons/NoteBlue.svg',
    },
    {
      route: '/settings',
      label: 'Settings',
      icon: 'assets/icons/Gear.svg',
      iconSelected: 'assets/icons/GearBlue.svg',
    },
  ];

  router = inject(Router);
  notification = inject(NotificationService);
  authService = inject(AuthService);

  constructor() {
    this.route.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setSelectedRoute();
      });
  }

  ngOnInit(): void {
    // this.selectedRoute = this.router.url.split('/')[1] || 'dashboard';
    this.setSelectedRoute();
  }

  setSelectedRoute() {
    const currentPath = this.route.url;
    const matchingItem = this.sideBarItems.find((item) =>
      currentPath.startsWith(item.route)
    );
    this.selectedRoute = matchingItem ? matchingItem.route : '';
  }

  selectRoute(route: string) {
    this.selectedRoute = route;
  }
}
