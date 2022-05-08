import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConversationComponent } from './delete-conversation.component';

describe('DeleteConversationComponent', () => {
  let component: DeleteConversationComponent;
  let fixture: ComponentFixture<DeleteConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConversationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
