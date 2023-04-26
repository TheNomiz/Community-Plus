import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserProfile } from '../user-profile.model';
import { UserProfileDeleteDialogComponent } from '../delete/user-profile-delete-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import { EntityArrayResponseType, UserProfileService } from '../service/user-profile.service';
import { UserProfileComponent } from '../list/user-profile.component';

import { HttpHeaders } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
})
export class UserProfileDetailComponent implements OnInit {
  userProfile: IUserProfile | null = null;
  verr: String = 'Not Verified';
  pubb: String = 'Public';
  darkMode = false;
  userp = document.querySelector('#userp') as HTMLDivElement;

  CFS = parseFloat(getComputedStyle(document.body).fontSize);
  CBC = '#FFFFFF';
  CC = getComputedStyle(document.body).color;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected userProfileService: UserProfileService,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userProfile }) => {
      this.userProfile = userProfile;
      let v = this.userProfile?.verified;
      let p = this.userProfile?.privateAccount;
      document.body.style.backgroundColor = '#FFFFFF';

      if (v) {
        this.verr = 'Verified';
      }

      if (p) {
        this.pubb = 'Private';
      }
    });
  }

  darkmode(): void {
    if (this.userProfile) {
      this.userProfile.darkmode = !this.userProfile.darkmode;

      if (this.userProfile.darkmode) {
        document.body.style.color = '#fff';
        document.body.style.backgroundColor = '#333';
        this.userp.style.backgroundColor = '#333';
        this.userp.style.color = 'fff';
      } else {
        document.body.style.color = this.CC;
        document.body.style.backgroundColor = this.CBC;
        this.userp.style.backgroundColor = this.CBC;
        this.userp.style.color = this.CC;
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
    }

    document.body.style.fontSize = this.CFS + 'px';
  }

  fontminus(): void {
    this.CFS *= 0.9;
    if (this.userProfile) {
      this.userProfile.fontsize = this.CFS;
    }
    document.body.style.fontSize = this.CFS + 'px';
  }

  pub(): void {
    if (this.userProfile) {
      this.userProfile.privateAccount = !this.userProfile.privateAccount;
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
    const status = parsedBody.status;
    console.log(`Status: ${status}`);

    if (status === 'verified' && this.userProfile) {
      this.userProfile.verified = true;
      this.verr = 'Verified';
    }
    const url = parsedBody.url;
    window.open('www.google.com');
  }
}
