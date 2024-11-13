import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetsFormsListComponent } from './tets-forms-list.component';

describe('TetsFormsListComponent', () => {
  let component: TetsFormsListComponent;
  let fixture: ComponentFixture<TetsFormsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetsFormsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetsFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
