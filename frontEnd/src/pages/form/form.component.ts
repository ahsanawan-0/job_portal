import { Component } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { TextareaComponent } from '../textarea/textarea.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [NgxEditorModule,TextareaComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

}
