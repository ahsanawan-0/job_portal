import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestViewPageComponent } from './test-view-page.component';

describe('TestViewPageComponent', () => {
  let component: TestViewPageComponent;
  let fixture: ComponentFixture<TestViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
