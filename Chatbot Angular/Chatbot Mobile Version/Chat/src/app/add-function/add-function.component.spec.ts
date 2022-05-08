import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFunctionComponent } from './add-function.component';

describe('AddFunctionComponent', () => {
  let component: AddFunctionComponent;
  let fixture: ComponentFixture<AddFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
