import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css',
})
export class ApplicationCardComponent {
  @Input() title: string = '';
  @Input() itemCount: number = 0;
  @Input() dropdownIndex: number = 0;
  @Input() dropdown: boolean[] = [];
  @Input() items: any[] = [];
  @Input() onClickThreeDots: (index: number) => void = () => {};
}
