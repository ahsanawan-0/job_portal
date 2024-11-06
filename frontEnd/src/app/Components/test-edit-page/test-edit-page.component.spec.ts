import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEditPageComponent } from './test-edit-page.component';

describe('TestEditPageComponent', () => {
  let component: TestEditPageComponent;
  let fixture: ComponentFixture<TestEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
