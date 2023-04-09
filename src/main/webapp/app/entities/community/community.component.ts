/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import * as L from 'leaflet';
import day from 'dayjs/esm';
import { EventCategory } from '../enumerations/event-category.model';
import { Message } from '@stomp/stompjs';
import { RxStompService } from './rxstomp.service';
import { Subscription } from 'rxjs';

const iconUrl = '../../../content/images/Location_Marker.png';
const shadowUrl = '../../../content/images/Location_Marker_Shadow.png';
const iconDefault = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'jhi-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  // api interfaces
  chatRooms: IChatRoom[] = [];
  chatMessages: IChatMessage[] = [];
  events: IEvent[] = [];
  businesses: IBusiness[] = [];

  roomMessages: IChatMessage[] = [];

  // map items
  map!: L.Map;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types, @typescript-eslint/member-ordering
  roomId: number = 0;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentRoom!: string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  message: string = '';

  // chatroom items
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;

  constructor(
    private busservice: BusinessService,
    private chatroomservice: ChatRoomService,
    private messageservice: ChatMessageService,
    private eventservice: EventService,
    private rxStompService: RxStompService
  ) {}

  ngOnInit(): void {
    // subscribe to chatroom
    this.topicSubscription = this.rxStompService.watch('/topic/' + this.roomId).subscribe((message: Message) => {
      const chatMessage: IChatMessage = JSON.parse(message.body);
      this.chatMessages.push(chatMessage);
      this.roomMessages.push(chatMessage);
    });

    // get all the data from the database
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

    // Get the chat room ID from the selected chat room
    this.roomId = this.getSelectedChatRoomId();

    // Initialize your Leaflet map
    this.map = L.map('map').setView([52.45, -1.93], 13);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    // Call the createMarkers function to add markers to the map for business and events
    this.createMarkers();
    // call events carousel
    this.getUpcomingEvents();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  createMarkers() {
    // add business to markers
    this.businesses.forEach(business => {
      if (business.latitude && business.longitude && business.name && business.description && business.category && business.phoneNumber) {
        const marker = L.marker([business.latitude, business.longitude]).bindPopup(
          `<b>${business.name}</b><br>${business.description}</br><br>${business.phoneNumber}</br><br>${business.category}`
        );
        marker.addTo(this.map);
      }
    });

    // add events to markers
    this.events.forEach(event => {
      if (event.latitude && event.longitude && event.name && event.description && event.startDate && event.endDate && event.address) {
        const marker = L.marker([event.latitude, event.longitude]).bindPopup(
          `<b>${event.name}</b><br>${event.description}</br><br>${event.address}</br><br>${event.startDate}</br><br>${event.endDate}`
        );
        marker.addTo(this.map);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getUpcomingEvents() {
    const now = day();
    const oneWeekFromNow = now.add(1, 'week');
    const upcomingEvents = this.events.filter(event => day(event.startDate).isAfter(now) && day(event.startDate).isBefore(oneWeekFromNow));
    return upcomingEvents;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getImage(event: IEvent) {
    switch (event.category) {
      case EventCategory.Conference:
        return '../../../content/images/conference.png';
      case EventCategory.Meetup:
        return '../../../content/images/meeting.png';
      case EventCategory.Seminar:
        return '../../../content/images/seminar.png';
      case EventCategory.Sport:
        return '../../../content/images/sport.png';
      case EventCategory.Webinar:
        return '../../../content/images/webinar.png';
      case EventCategory.Workshop:
        return '../../../content/images/workshop.png';
      default:
        return '../../../content/images/defaultevent.png';
    }
  }

  getSelectedChatRoomId(): number {
    return this.roomId;
  }

  onSendMessage() {
    const chatMessage: IChatMessage = {
      id: this.chatMessages.length + 1,
      content: this.message,
      sentDate: day(),
      postedby: null,
      room: { id: this.roomId },
    };
    this.rxStompService.publish({ destination: `/topic/${this.roomId}`, body: JSON.stringify(chatMessage) });
    // clear the message
    this.message = '';
  }

  joinRoom(room: IChatRoom) {
    // unsubscribe from the current chatroom
    this.topicSubscription.unsubscribe();

    // change the current chatroom
    this.roomId = room.id;
    this.currentRoom = room.name;

    // get all the messages for the new chatroom
    this.chatroomservice.query().subscribe((res: HttpResponse<IChatRoom[]>) => {
      this.chatRooms = res.body ?? [];
    });

    const roomId = this.roomId;
    this.roomMessages = this.chatMessages.filter(message => message.room?.id === roomId);

    // subscribe to the new chatroom
    this.topicSubscription = this.rxStompService.watch('/topic/' + this.roomId).subscribe((message: Message) => {
      const chatMessage: IChatMessage = JSON.parse(message.body);
      this.chatMessages.push(chatMessage);
      this.roomMessages.push(chatMessage);
    });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }
}
