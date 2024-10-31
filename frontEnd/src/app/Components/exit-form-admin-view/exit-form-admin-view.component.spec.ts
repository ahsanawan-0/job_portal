import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormAdminViewComponent } from './exit-form-admin-view.component';

describe('ExitFormAdminViewComponent', () => {
  let component: ExitFormAdminViewComponent;
  let fixture: ComponentFixture<ExitFormAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitFormAdminViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
