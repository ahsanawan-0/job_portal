import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredCandidateComponent } from './hired-candidate.component';

describe('HiredCandidateComponent', () => {
  let component: HiredCandidateComponent;
  let fixture: ComponentFixture<HiredCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiredCandidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiredCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
