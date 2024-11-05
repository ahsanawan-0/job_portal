import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormResultsComponent } from './test-form-results.component';

describe('TestFormResultsComponent', () => {
  let component: TestFormResultsComponent;
  let fixture: ComponentFixture<TestFormResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFormResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
