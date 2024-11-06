import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataTableComponent } from './user-data-table.component';

describe('UserDataTableComponent', () => {
  let component: UserDataTableComponent;
  let fixture: ComponentFixture<UserDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
