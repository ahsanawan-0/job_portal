import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule for reactive forms
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // Import NgbActiveModal
import { PasswordResetModalComponent } from './reset-password-modal.component'; // Correct the import path

describe('PasswordResetModalComponent', () => {
  let component: PasswordResetModalComponent;
  let fixture: ComponentFixture<PasswordResetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule
      declarations: [PasswordResetModalComponent], // Declare the component
      providers: [NgbActiveModal], // Provide NgbActiveModal
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests here, such as for form submission, validation, etc.
});
