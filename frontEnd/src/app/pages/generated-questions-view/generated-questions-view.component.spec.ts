import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedQuestionsViewComponent } from './generated-questions-view.component';

describe('GeneratedQuestionsViewComponent', () => {
  let component: GeneratedQuestionsViewComponent;
  let fixture: ComponentFixture<GeneratedQuestionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedQuestionsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedQuestionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
