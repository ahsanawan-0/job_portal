import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import gsap from 'gsap';
import { LayoutComponent } from './Components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
    // Listen to router events for route transitions
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.animateTransition();
      }
    });
  }

  // Function to animate transitions on route change
  animateTransition() {
    const tl = gsap.timeline();
    tl.from('.content', {
      opacity: 0,
      duration: 1.5, // Slower animation
      ease: 'circ.inOut' // Smooth ease for a more natural motion
    })
    .from('.main-content', {
      opacity: 0,
      x: -50, // Increased distance for a more dramatic entrance
      duration: 1, // Slower animation
      ease: 'circ.inOut'
    }, '-=1'); // More overlap for a smoother overall effect
  }

  // Additional method to customize or trigger animations after component load
  onRouteChange(event: any) {
    gsap.from(event.constructor.name, {
      opacity: 0,
      duration: 1, // Slower entry for individual components
      ease: 'power2.out'
    });
  }
}
