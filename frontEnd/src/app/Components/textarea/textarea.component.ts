import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgxEditorModule],
})
export class TextareaComponent implements OnInit, OnDestroy {
  @Input() content!: string; // Input property for the editor content
  @Input() placeholder_text: string = 'Enter your content here...'; // Input property for dynamic placeholder
  @Output() contentChange = new EventEmitter<string>(); // Output event for content changes

  editor!: Editor; // Instance of the editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['ordered_list','bullet_list'],
    ['link'],
    ['text_color', 'background_color'],
    
  ];
  form: FormGroup; // Reactive form for the editor content

  constructor() {
    // Initialize the form with an empty string or any default string you want
    this.form = new FormGroup({
      editorContent: new FormControl('', Validators.required), // Leave empty or provide default content
    });
  }

  ngOnInit(): void {
    this.editor = new Editor(); // Initialize the editor

    // Set the initial value of the form control based on the input content
    if (this.content) {
      this.form.get('editorContent')?.setValue(this.content);
    }

    // Listen for changes in the form control
    this.form.get('editorContent')?.valueChanges.subscribe((value) => {
      this.onContentChange(value); // Emit changes
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy(); // Clean up the editor instance
  }

  // Method to emit the changes
  private onContentChange(content: string): void {
    this.content = content; // Update local content
    this.contentChange.emit(this.content); // Emit the change
  }
}