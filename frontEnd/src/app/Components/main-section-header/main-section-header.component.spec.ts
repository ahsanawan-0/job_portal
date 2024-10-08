import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSectionHeaderComponent } from './main-section-header.component';

describe('MainSectionHeaderComponent', () => {
  let component: MainSectionHeaderComponent;
  let fixture: ComponentFixture<MainSectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSectionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
