import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFunctionComponent } from './edit-function.component';

describe('EditFunctionComponent', () => {
  let component: EditFunctionComponent;
  let fixture: ComponentFixture<EditFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
