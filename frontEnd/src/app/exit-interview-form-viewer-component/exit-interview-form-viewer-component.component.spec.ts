import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitInterviewFormViewerComponentComponent } from './exit-interview-form-viewer-component.component';

describe('ExitInterviewFormViewerComponentComponent', () => {
  let component: ExitInterviewFormViewerComponentComponent;
  let fixture: ComponentFixture<ExitInterviewFormViewerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitInterviewFormViewerComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitInterviewFormViewerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
