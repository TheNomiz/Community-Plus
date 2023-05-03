import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CrimeAlertService } from '../entities/crime-alert/service/crime-alert.service';
import { ICrimeAlert } from '../entities/crime-alert/crime-alert.model';
import { LostFoundService } from '../entities/lost-found/service/lost-found.service';
import { ILostFound } from '../entities/lost-found/lost-found.model';
import { EventService } from '../entities/event/service/event.service';
import { IEvent } from 'app/entities/event/event.model';
import day from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { data } from 'cypress/types/jquery';
import { EntityArrayResponseType } from '../entities/event/service/event.service';
import { HttpResponse } from '@angular/common/http';
import dayjs from 'dayjs/esm';
import { EventCategory } from '../entities/enumerations/event-category.model';
import { IUserProfile } from '../entities/user-profile/user-profile.model';
import { IChatRoom } from '../entities/chat-room/chat-room.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  get crimes(): EntityArrayResponseType {
    return <HttpResponse<IEvent[]>>this._crimes;
  }

  set crimes(value: EntityArrayResponseType) {
    this._crimes = value;
  }
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  crimealerts: ICrimeAlert[] = [];
  lostfound: ILostFound[] = [];

  eventsarray: IEvent[] = [];

  protected _crimes: EntityArrayResponseType | undefined;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private repo: CrimeAlertService,
    private eventrepo: EventService,
    private lostrepo: LostFoundService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.repo.query().subscribe(data => {
      if (data.body)
        this.crimealerts = data.body.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          lat: item.lat,
          lon: item.lon,
          date: item.date,
          crimeID: item.crimeID,
          crimeType: item.crimeType,
          crimePhoto1: item.crimePhoto1,
          crimePhoto1ContentType: item.crimePhoto1ContentType,
          crimePhoto2: item.crimePhoto2,
          crimePhoto2ContentType: item.crimePhoto2ContentType,
          crimePhoto3: item.crimePhoto3,
          crimePhoto3ContentType: item.crimePhoto3ContentType,
          postedby: item.postedby,
        }));
    });

    this.lostrepo.query().subscribe(data => {
      if (data.body) {
        this.lostfound = data.body.map(item => ({
          id: item.id,
          description: item.description,
          date: item.date,
          location: item.location,
          item: item.item,
          name: item.name,
          email: item.email,
          phoneNumber: item.phoneNumber,
          postedby: item.postedby,
        }));
      }
    });

    this.eventrepo.query().subscribe(data => {
      if (data.body) {
        this.eventsarray = data.body;
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatDate(date: day.Dayjs | null | undefined): string {
    if (date) {
      const dayjsDate = typeof date === 'string' ? day(date) : date;
      return dayjsDate.format('MMM D, YYYY h:mm A');
    } else {
      return '';
    }
  }
}
