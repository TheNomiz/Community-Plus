import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { accountState } from '../../../account/account.route';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { UserService } from '../../user/user.service';
import { IUser } from '../../user/user.model';

import { IUserProfile, NewUserProfile } from '../user-profile.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, UserProfileService } from '../service/user-profile.service';
import { UserProfileDeleteDialogComponent } from '../delete/user-profile-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { accountMenuSelector } from '../../../../../../test/javascript/cypress/support/commands';

@Component({
  selector: 'jhi-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  userProfiles?: IUserProfile[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  account: Account | null = null;
  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  userProfile: IUserProfile | null = null;

  verr: String = 'Not Verified';
  pubb: String = 'Public';
  darkMode = false;

  CFS = parseFloat(getComputedStyle(document.body).fontSize);
  CBC = '#FFFFFF';
  CC = getComputedStyle(document.body).color;

  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,

    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    private loginService: LoginService,

    private userService: UserService,
    protected modalService: NgbModal
  ) {}

  reset(): void {
    this.page = 1;
    this.userProfiles = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IUserProfile): number => this.userProfileService.getUserProfileIdentifier(item);

  ngOnInit(): void {
    this.load();
    this.loaduser();
  }

  async loaduser(): Promise<void> {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userService.query().subscribe(async response => {
          const users: IUser[] = await (response.body ? response.body : []);
          const user = users.find(u => u.login === account.login);

          if (this.userProfiles && users !== undefined) {
            this.userProfile = this.userProfiles.find(userprofile => userprofile.userID?.id === user?.id) as IUserProfile;
          } else {
            const userProfile: NewUserProfile = {
              id: null,
              username: null,
              firstnames: null,
              lastname: null,
              password: null,
              email: null,
              language: null,
              verified: false,
              privateAccount: false,
              age: null,
              accountType: null,
              occupation: null,
              streetAddress: null,
              city: null,
              communityPoints: null,
              postalCode: null,
              bio: null,
              phoneNumber: null,
              gPS: null,
              fontsize: null,
              darkmode: null,
              userID: user,
            };

            this.userProfileService.create(userProfile).subscribe(async response => {
              this.userProfile = await response.body;
            });
          }
        });
      }
    });

    if (this.userProfiles) {
      let v = this.userProfile?.verified;
      let p = this.userProfile?.privateAccount;
      document.body.style.backgroundColor = '#FFFFFF';

      if (v) {
        this.verr = 'Verified';
      }

      if (p) {
        this.pubb = 'Private';
      }
    }
  }

  darkmode(): void {
    if (this.userProfile) {
      this.userProfile.darkmode = !this.userProfile.darkmode;
      this.userProfileService.update(this.userProfile);

      if (this.userProfile.darkmode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  fontplus(): void {
    this.CFS *= 1.1;
    if (this.userProfile) {
      this.userProfile.fontsize = this.CFS;
      this.userProfileService.update(this.userProfile);
    }

    document.body.style.fontSize = this.CFS + 'px';
  }

  fontminus(): void {
    this.CFS *= 0.9;
    if (this.userProfile) {
      this.userProfile.fontsize = this.CFS;
      this.userProfileService.update(this.userProfile);
    }
    document.body.style.fontSize = this.CFS + 'px';
  }

  pub(): void {
    if (this.userProfile) {
      this.userProfile.privateAccount = !this.userProfile.privateAccount;
      this.userProfileService.update(this.userProfile);
      if (this.userProfile.privateAccount) {
        this.pubb = 'Private';
      } else {
        this.pubb = 'Public';
      }
    }
  }

  async verify(): Promise<void> {
    const data = {
      type: 'document',
    };

    const response = await fetch('https://api.stripe.com/v1/identity/verification_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer sk_test_26PHem9AhJZvU623DfE1x4sd',
      },
      body: new URLSearchParams(data).toString(),
    });

    const parsedBody = await response.json();
    const url = parsedBody.url;
    const sessionId = parsedBody.id;
    window.open(url);

    // Wait for 5 minutes before sending the second fetch request
    await new Promise(resolve => setTimeout(resolve, 300000));

    const response2 = await fetch(`https://api.stripe.com/v1/identity/verification_sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer sk_test_26PHem9AhJZvU623DfE1x4sd',
      },
    });

    const parsedBody2 = await response2.json();
    const status2 = parsedBody2.status;
    if (status2 === 'verified' && this.userProfile) {
      this.userProfile.verified = true;
      this.verr = 'Verified';
      this.userProfileService.update(this.userProfile);
    }
  }

  delete(userProfile: IUserProfile): void {
    const modalRef = this.modalService.open(UserProfileDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userProfile = userProfile;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.userProfiles = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IUserProfile[] | null): IUserProfile[] {
    const userProfilesNew = this.userProfiles ?? [];
    if (data) {
      for (const d of data) {
        if (userProfilesNew.map(op => op.id).indexOf(d.id) === -1) {
          userProfilesNew.push(d);
        }
      }
    }

    return userProfilesNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.userProfileService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
