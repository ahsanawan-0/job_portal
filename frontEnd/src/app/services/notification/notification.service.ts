import { Injectable } from '@angular/core';
import { success, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}
  showSuccess(message: string) {
    success({
      text: message,
      delay: 3000,
      width: '350px',
    });
  }

  showError(message: string) {
    error({
      text: message,
      delay: 3000,
      width: '350px',
    });
  }
}
