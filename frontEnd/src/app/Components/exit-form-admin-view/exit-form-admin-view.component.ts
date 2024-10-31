import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExitInterviewService } from '../../services/exit_interview/exit-interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitInterviewModalComponent } from '../../modals/exit-interview-modal/exit-interview-modal.component';
interface Question {
  label: string;
  type: string;
  options: string[];
}

interface FormData {
  _id: string;
  title: string;
  questions: Question[];
  uniqueLinkId: string;
}

@Component({
  selector: 'app-exit-form-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exit-form-admin-view.component.html',
  styleUrl: './exit-form-admin-view.component.css',
})
export class ExitFormAdminViewComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  uniqueLinkId: string = '';
  modalService = inject(NgbModal);

  extractUniqueLinkIdId(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.uniqueLinkId = params['uniqueLinkId'];
      console.log('Extracted uniqueLinkId:', this.uniqueLinkId);
    });
  }

  ngOnInit(): void {
    this.extractUniqueLinkIdId();
    this.getForm();
  }

  service = inject(ExitInterviewService);
  formData: FormData = { _id: '', title: '', questions: [], uniqueLinkId: '' };
  getForm() {
    this.service.getForm(this.uniqueLinkId).subscribe((res: any) => {
      this.formData = res.response;
    });
  }

  onUpdate() {
    this.service
      .updateForm(this.uniqueLinkId, this.formData)
      .subscribe((res: any) => {
        alert('form updated');
      });
  }
  isEditing: boolean = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  addOption(question: any) {
    question.options.push('');
  }

  removeOption(options: string[], index: number) {
    options.splice(index, 1);
  }

  addQuestion() {
    this.formData.questions.push({
      label: '',
      type: 'text',
      options: [],
    });
  }

  removeQuestion(index: number): void {
    this.formData.questions.splice(index, 1);
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

  openModal() {
    const modalRef = this.modalService.open(ExitInterviewModalComponent);
    modalRef.componentInstance.link = `http://localhost:4200/exitInterviewViewForm/${this.uniqueLinkId}`;
  }
}
