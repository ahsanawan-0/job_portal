import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditAbleFieldComponent } from '../edit-able-field/edit-able-field.component';
import { UserDataTableComponent } from '../user-data-table/user-data-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditAbleFieldComponent,
    UserDataTableComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  service = inject(AuthService);
  modalService = inject(NgbModal);
  notification = inject(NotificationService);
  userData = {
    name: '',
    email: '',
    password: '',
    designation: '',
  };
  editingField: string | null = null;
  designation: string = '';
  check: boolean = false;

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.service.getUserData().subscribe((res: any) => {
      this.userData = res.user;
      this.designation = this.userData.designation;
      console.log('designation', this.designation);
      if (this.designation == 'admin') {
        this.check = true;
        console.log('if admin ', this.check);
        // this.getAllusers();
        this.getAllUsersNotAdmin();
      } else {
        console.log(this.designation);
      }
    });
  }

  toggleEdit(field: string) {
    if (this.editingField === field) {
      // this.updateUserData();
      this.editingField = null;
    } else {
      this.userData = { ...this.userData };
      this.editingField = field;
    }
  }

  updateUserData(field: string, newValue: string) {
    this.userData = { ...this.userData, [field]: newValue };
    this.service.updateUserData(this.userData).subscribe((res: any) => {
      if (res) {
        this.notification.showSuccess(res.message);
        this.editingField = null;
      } else {
        this.notification.showError(res.message);
      }
    });
  }
  cancelEdit(): void {
    this.userData = { ...this.userData };
    this.editingField = null;
  }

  // users: any[] = [];
  // getAllusers() {
  //   this.service.getAllUsers().subscribe((res: any) => {
  //     this.users = res.data;
  //   });
  // }

  users: any[] = [];
  getAllUsersNotAdmin() {
    this.service.getAllUsersExceptAdmin().subscribe((res: any) => {
      this.users = res.data;
    });
  }

  // onClickDelete(email: string) {
  //   this.service.deleteUserByEmail(email).subscribe((res: any) => {
  //     if (res) {
  //       this.notification.showSuccess(res.message);
  //       this.getAllusers();
  //     } else {
  //       this.notification.showError(res.message);
  //     }
  //   });
  // }

  onDelete(email: string, name: string) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    modalRef.componentInstance.jobName = name;
    modalRef.componentInstance.modalTitle = 'Confirm Deletion';
    modalRef.componentInstance.modalMessage =
      'Are you sure you want to delete this user';
    modalRef.componentInstance.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.service.deleteUserByEmail(email).subscribe((res: any) => {
          if (res) {
            this.notification.showSuccess(res.message);
            // this.getAllusers();
            this.getAllUsersNotAdmin();
          } else {
            this.notification.showError(res.message);
          }
        });
      }
    });
  }
}
