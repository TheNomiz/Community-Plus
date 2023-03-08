import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChatRoomDetailComponent } from './chat-room-detail.component';

describe('ChatRoom Management Detail Component', () => {
  let comp: ChatRoomDetailComponent;
  let fixture: ComponentFixture<ChatRoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chatRoom: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChatRoomDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChatRoomDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chatRoom on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chatRoom).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
