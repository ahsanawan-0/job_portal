import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Editor } from 'ngx-editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, NgxEditorModule],
})
export class TextareaComponent implements OnInit, OnDestroy {
  @Input() content!: string; // Input property for the editor content
  @Output() contentChange = new EventEmitter<string>(); // Output event for content changes

  editor!: Editor;

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // This method is called when the editor content changes
  onContentChange(content: string): void {
    this.content = content;
    this.contentChange.emit(this.content); // Emit the change
  }
}
