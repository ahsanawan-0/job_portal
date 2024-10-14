import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
import { FormsModule } from '@angular/forms';

interface Question {
  label: string;
  type: 'text' | 'textarea' | 'radio';
  options?: string[];
}

@Component({
  selector: 'app-exit-interview-form',
  standalone: true,
  imports: [CommonModule, ExitInterviewModalComponent, FormsModule],
  templateUrl: './exit-interview-form.component.html',
  styleUrls: ['./exit-interview-form.component.css']
})
export class ExitInterviewFormComponent {
  private modalService = inject(NgbModal);

  formTitle: string = '';
  questions: Question[] = [];
  newQuestionType: 'text' | 'textarea' | 'radio' = 'text';
  newRadioOptionsCount: number = 2;
  newQuestionLabel: string = ''; // Label for the new question

  openApplyModal() {
    const modalRef = this.modalService.open(ExitInterviewModalComponent, { size: 'lg' });
  }

  addQuestion() {
    if (!this.newQuestionLabel && this.newQuestionType === 'radio') {
      alert('Please enter a question label before adding radio options.');
      return;
    }

    const newQuestion: Question = {
      label: this.newQuestionLabel || `Question ${this.questions.length + 1}`, // Use user input or default label
      type: this.newQuestionType,
      options: this.newQuestionType === 'radio' ? Array(this.newRadioOptionsCount).fill('') : []
    };

    // Reset the inputs after adding the question
    this.newQuestionLabel = '';
    this.newRadioOptionsCount = 2; // Reset to default

    // Push the new question to the questions array
    this.questions.push(newQuestion);
    console.log('Current Questions:', this.questions); // Debugging: Log the questions array
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
    console.log('Question deleted, current questions:', this.questions); // Debugging: Log current questions after deletion
  }

  saveForm() {
    console.log('Form Title:', this.formTitle);
    
    // Log the questions
    this.questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.label}`);
      console.log(`Type: ${question.type}`);
      if (question.type === 'radio') {
        console.log('Options:', question.options);
      }
    });
  }
}
