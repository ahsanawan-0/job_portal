import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluteTestComponent } from './evalute-test.component';

describe('EvaluteTestComponent', () => {
  let component: EvaluteTestComponent;
  let fixture: ComponentFixture<EvaluteTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluteTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluteTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
