import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Editor } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  encapsulation: ViewEncapsulation.None,  // Add this to disable view encapsulation
  imports: [CommonModule, FormsModule, NgxEditorModule],
})
export class TextareaComponent implements OnInit, OnDestroy {
  editor!: Editor; // Ensure editor is initialized
  html: string = ''; // For storing the content of the editor

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
