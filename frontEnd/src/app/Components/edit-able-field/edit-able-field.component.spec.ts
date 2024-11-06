import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbleFieldComponent } from './edit-able-field.component';

describe('EditAbleFieldComponent', () => {
  let component: EditAbleFieldComponent;
  let fixture: ComponentFixture<EditAbleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAbleFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAbleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
