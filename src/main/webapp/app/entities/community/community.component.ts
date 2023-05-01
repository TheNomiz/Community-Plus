/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ChatMessageService } from 'app/entities/chat-message/service/chat-message.service';
import { ChatRoomService } from 'app/entities/chat-room/service/chat-room.service';
import { EventService } from 'app/entities/event/service/event.service';
import { IChatRoom } from 'app/entities/chat-room/chat-room.model';
import { IChatMessage, NewChatMessage } from 'app/entities/chat-message/chat-message.model';
import { IEvent } from 'app/entities/event/event.model';
import { IBusiness } from 'app/entities/business/business.model';
import * as L from 'leaflet';
import day from 'dayjs/esm';
import { EventCategory } from '../enumerations/event-category.model';
import { Message } from '@stomp/stompjs';
import { RxStompService } from './rxstomp.service';
import { Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user.model';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { IUserProfile } from '../user-profile/user-profile.model';
import { VoiceRecognitionService } from 'app/service/voicerecognition.service';

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

  // voice recognition vars
  isStillRecoginze = false;
  serviceState = false;

  // current user
  user!: IUser | undefined;
  usersprofile!: IUserProfile | null | undefined;
  anonymous = true;

  // map items
  map!: L.Map;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types, @typescript-eslint/member-ordering
  roomId: number = 0;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentRoom!: string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  message: string = '';
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  subscribed: boolean = false;

  // chatroom items
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;

  constructor(
    protected busservice: BusinessService,
    protected chatroomservice: ChatRoomService,
    protected messageservice: ChatMessageService,
    protected eventservice: EventService,
    protected rxStompService: RxStompService,
    protected accountService: AccountService,
    protected userService: UserService,
    protected userprofileService: UserProfileService,
    private router: Router,
    public voiceservice: VoiceRecognitionService
  ) {
    this.voiceservice.init();
  }

  ngOnInit(): void {
    // subscribe to chatroom
    /*
    this.topicSubscription = this.rxStompService.watch('/topic/' + this.roomId).subscribe((message: Message) => {
      const chatMessage: IChatMessage = JSON.parse(message.body);
      this.chatMessages.push(chatMessage);
      this.roomMessages.push(chatMessage);
    });
*/

    // get current user
    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.userService.query().subscribe(response => {
          const users = response.body;
          if (users) {
            this.user = users.find(user => user.login === account.login);
          }
        });
      }
    });

    // get all users profiles and get the current users profile
    this.userprofileService.query().subscribe((res: HttpResponse<IUserProfile[]>) => {
      const usersprofile = res.body ?? [];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.user && this.user !== undefined) {
        this.usersprofile = usersprofile.find(userprofile => userprofile.userID?.id === this.user?.id);
        if (this.usersprofile?.privateAccount === false) {
          this.anonymous = false;
        }
      }
    });

    // get all the data from the database
    this.chatroomservice.query().subscribe((res: HttpResponse<IChatRoom[]>) => {
      this.chatRooms = res.body ?? [];
    });

    this.busservice.query().subscribe((res: HttpResponse<IBusiness[]>) => {
      this.businesses = res.body ?? [];

      // add markers to map
      this.businesses.forEach(business => {
        if (
          business.latitude &&
          business.longitude &&
          business.name &&
          business.description &&
          business.category &&
          business.phoneNumber &&
          business.latitude >= -90 &&
          business.latitude <= 90 &&
          business.longitude >= -180 &&
          business.longitude <= 180
        ) {
          const marker = L.marker([business.latitude, business.longitude]).bindPopup(
            `<b>${business.name}</b><br>${business.description}</br><br>${business.phoneNumber}</br><br>${business.category}`
          );
          marker.addTo(this.map);
        }
        // create chatroom for business
        if (business.name) {
          // check if chatroom with same name already exists
          const chatroomExists = this.chatRooms.some(chatroom => chatroom.name === business.name);
          if (!chatroomExists) {
            this.chatroomservice
              .create({
                id: null,
                name: business.name,
              })
              .subscribe(response => {
                const newChatroom = response.body;
                if (newChatroom) {
                  this.chatRooms.push(newChatroom);
                }
              });
          }
        }
      });
    });

    this.messageservice.query().subscribe((res: HttpResponse<IChatMessage[]>) => {
      this.chatMessages = res.body ?? [];
    });

    this.eventservice.query().subscribe((res: HttpResponse<IEvent[]>) => {
      this.events = res.body ?? [];

      // add events to markers
      this.events.forEach(event => {
        if (
          event.latitude &&
          event.longitude &&
          event.name &&
          event.description &&
          event.startDate &&
          event.endDate &&
          event.address &&
          event.latitude >= -90 &&
          event.latitude <= 90 &&
          event.longitude >= -180 &&
          event.longitude <= 180
        ) {
          const marker = L.marker([event.latitude, event.longitude]).bindPopup(
            `<b>${event.name}</b><br>${event.description}</br><br>${event.address}</br><br>${event.startDate}</br><br>${event.endDate}`
          );
          marker.addTo(this.map);
        }
      });

      // create chatroom for each event
      this.events.forEach(event => {
        if (event.name) {
          // check if chatroom with same name already exists
          const chatroomExists = this.chatRooms.some(chatroom => chatroom.name === event.name);
          if (!chatroomExists) {
            this.chatroomservice
              .create({
                id: null,
                name: event.name,
              })
              .subscribe(response => {
                const newChatroom = response.body;
                if (newChatroom) {
                  this.chatRooms.push(newChatroom);
                }
              });
          }
        }
      });
    });

    // Get the chat room ID from the selected chat room
    this.roomId = this.getSelectedChatRoomId();

    // Initialize your Leaflet map
    this.map = L.map('map', {
      maxBounds: L.latLngBounds(L.latLng(49.78, -13.13), L.latLng(60.89, 2.87)),
      maxZoom: 18,
      minZoom: 6,
    }).setView([51.4, 0.3], 9);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.addTo(this.map);

    // call events carousel
    this.getUpcomingEvents();
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
    const chatMessage: NewChatMessage = {
      id: null,
      content: this.message,
      sentDate: day(),
      postedby: null,
      room: { id: this.roomId },
    };
    if (this.anonymous === false) {
      chatMessage.postedby = this.usersprofile;
    }

    this.rxStompService.publish({ destination: `/topic/${this.roomId}`, body: JSON.stringify(chatMessage) });
    // clear the message
    this.message = '';
    // send the message to the server
    this.messageservice.create(chatMessage).subscribe();
  }

  joinRoom(room: IChatRoom) {
    // unsubscribe from the current chatroom
    if (this.subscribed === true) {
      this.topicSubscription.unsubscribe();
    }

    // change the current chatroom
    this.roomId = room.id;
    this.currentRoom = room.name;

    // get all the messages for the new chatroom
    const roomId = this.roomId;
    this.roomMessages = this.chatMessages.filter(message => message.room?.id === roomId);

    // subscribe to the new chatroom
    this.topicSubscription = this.rxStompService.watch('/topic/' + this.roomId).subscribe((message: Message) => {
      const chatMessage: IChatMessage = JSON.parse(message.body);
      this.chatMessages.push(chatMessage);
      this.roomMessages.push(chatMessage);
    });
    this.subscribed = true;
  }

  formatDate(date: day.Dayjs | null | undefined): string {
    if (date) {
      const dayjsDate = typeof date === 'string' ? day(date) : date;
      return dayjsDate.format('MMM D, YYYY h:mm A');
    } else {
      return '';
    }
  }

  getUserName(usersprofile: IUserProfile | null | undefined): string {
    if (usersprofile) {
      if (usersprofile.privateAccount === false && usersprofile.username) {
        return usersprofile.username;
      } else {
        return 'Anonymous';
      }
    } else {
      return 'Anonymous';
    }
  }

  createNewEvent() {
    this.router.navigate(['/event/new']);
  }

  createNewBusiness() {
    this.router.navigate(['/business/new']);
  }

  toggleService() {
    this.serviceState = !this.serviceState;
    if (this.serviceState) {
      this.startService();
    } else {
      this.stopService();
    }
  }

  startService() {
    this.isStillRecoginze = this.voiceservice.start() === true ? true : false;
  }

  stopService() {
    this.isStillRecoginze = this.voiceservice.stop() === false ? false : true;
    this.message = this.voiceservice.text;
  }

  ngOnDestroy() {
    if (this.subscribed === true) {
      this.topicSubscription.unsubscribe();
    }
  }
}
