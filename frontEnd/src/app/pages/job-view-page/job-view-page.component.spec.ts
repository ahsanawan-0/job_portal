import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewPageComponent } from './job-view-page.component';

describe('JobViewPageComponent', () => {
  let component: JobViewPageComponent;
  let fixture: ComponentFixture<JobViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
