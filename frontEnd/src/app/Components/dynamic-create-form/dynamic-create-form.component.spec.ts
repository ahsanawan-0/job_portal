import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCreateFormComponent } from './dynamic-create-form.component';

describe('DynamicCreateFormComponent', () => {
  let component: DynamicCreateFormComponent;
  let fixture: ComponentFixture<DynamicCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
