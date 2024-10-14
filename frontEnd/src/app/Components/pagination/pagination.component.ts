import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  activePage: number = 1;
  isHovered: { [key: number]: boolean } = {};

  get totalPagesArray(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  setActivePage(page: number): void {
    this.activePage = page;
    this.pageChange.emit(this.activePage);
  }

  toggleHover(page: number, hoverState: boolean): void {
    this.isHovered[page] = hoverState;
  }

  previousPage(): void {
    if (this.activePage > 1) {
      this.setActivePage(this.activePage - 1);
    }
  }

  nextPage(): void {
    if (this.activePage < this.totalPagesArray.length) {
      this.setActivePage(this.activePage + 1);
    }
  }
}
