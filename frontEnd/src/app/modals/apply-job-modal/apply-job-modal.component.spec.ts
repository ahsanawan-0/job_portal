import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyJobModalComponent } from './apply-job-modal.component';

describe('ApplyJobModalComponent', () => {
  let component: ApplyJobModalComponent;
  let fixture: ComponentFixture<ApplyJobModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyJobModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
