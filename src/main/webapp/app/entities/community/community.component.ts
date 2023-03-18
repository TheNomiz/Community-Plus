import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ChatMessageService } from 'app/entities/chat-message/service/chat-message.service';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';
import { EventService } from 'app/entities/event/service/event.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { IChatMessage } from 'app/entities/chat-message/chat-message.model';
import { IEvent } from 'app/entities/event/event.model';
import { IBusiness } from 'app/entities/business/business.model';
import { latLng, tileLayer, Map } from 'leaflet';

@Component({
  selector: 'jhi-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  chatRooms: IChatRoom[] = [];
  chatMessages: IChatMessage[] = [];
  events: IEvent[] = [];
  businesses: IBusiness[] = [];

  images = [944, 1011, 984].map(n => `https://picsum.photos/id/${n}/900/500`);

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&amp;copy; OpenStreetMap contributors',
      }),
    ],
    zoom: 13,
    center: latLng([52.45, -1.93]),
  };

  constructor(
    private busservice: BusinessService,
    private chatroomservice: ChatRoomService,
    private messageservice: ChatMessageService,
    private eventservice: EventService
  ) {}

  ngOnInit(): void {
    this.chatroomservice.query().subscribe((res: HttpResponse<IChatRoom[]>) => {
      this.chatRooms = res.body ?? [];
    });

    this.busservice.query().subscribe((res: HttpResponse<IBusiness[]>) => {
      this.businesses = res.body ?? [];
    });

    this.messageservice.query().subscribe((res: HttpResponse<IChatMessage[]>) => {
      this.chatMessages = res.body ?? [];
    });

    this.eventservice.query().subscribe((res: HttpResponse<IEvent[]>) => {
      this.events = res.body ?? [];
    });
  }
}
