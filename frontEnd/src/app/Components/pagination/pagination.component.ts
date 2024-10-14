import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  pages: number[] = [1, 2, 3, 4];
  activePage: number = 1;
  isHovered: { [key: number]: boolean } = {};

  setActivePage(page: number): void {
    this.activePage = page;
  }
  toggleHover(page: number, hoverState: boolean): void {
    this.isHovered[page] = hoverState;
  }
}
