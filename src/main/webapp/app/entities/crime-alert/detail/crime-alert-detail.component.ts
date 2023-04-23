import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICrimeAlert } from '../crime-alert.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { HttpResponse } from '@angular/common/http'; // Import the Comment model
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrimeTypes } from 'app/entities/enumerations/crime-types.model';

@Component({
  selector: 'jhi-crime-alert-detail',
  templateUrl: './crime-alert-detail.component.html',
  styleUrls: ['./details.css'],
})
export class CrimeAlertDetailComponent implements OnInit {
  crimeAlert: ICrimeAlert | null = null;
  comments: IComment[] = []; // Add a property to store the comments
  address = '';

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crimeAlert }) => {
      this.crimeAlert = crimeAlert;
      this.loadComments(); // Load the comments when the crime alert is loaded
      this.getAddressFromCoordinates(crimeAlert.lat, crimeAlert.lon);
    });
  }
  getCrimeTypeDisplay(crimeType: string | null | undefined): string {
    switch (crimeType) {
      case CrimeTypes.ALLCRIME.toString():
        return 'All crime';
      case CrimeTypes.ANTISOCIALBEHAVIOUR.toString():
        return 'Anti-social behaviour';
      case CrimeTypes.BICYCLETHEFT.toString():
        return 'Bicycle theft';
      case CrimeTypes.BURGLARY.toString():
        return 'Burglary';
      case CrimeTypes.CRIMINALDAMAGEARSON.toString():
        return 'Criminal damage and arson';
      case CrimeTypes.DRUGS.toString():
        return 'Drugs';
      case CrimeTypes.OTHERTHEFT.toString():
        return 'Other theft';
      case CrimeTypes.POSSESSIONOFWEAPONS.toString():
        return 'Possession of weapons';
      case CrimeTypes.PUBLICORDER.toString():
        return 'Public order';
      case CrimeTypes.ROBBERY.toString():
        return 'Robbery';
      case CrimeTypes.SHOPLIFTING.toString():
        return 'Shoplifting';
      case CrimeTypes.THEFTFROMTHEPERSON.toString():
        return 'Theft from the person';
      case CrimeTypes.VEHICLECRIME.toString():
        return 'Vehicle crime';
      case CrimeTypes.VIOLENCEANDSEXUALOFFENCES.toString():
        return 'Violence and sexual offences';
      case CrimeTypes.OTHERCRIME.toString():
        return 'Other crime';
      default:
        return '';
    }
  }

  getCrimePhotoContentType(index: number): string | null {
    if (this.crimeAlert != null) {
      const contentType = this.crimeAlert[`crimePhoto${index + 1}ContentType` as keyof ICrimeAlert];
      return contentType ? (contentType as string) : null;
    }
    return '0';
  }

  getAddressFromCoordinates(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    this.http
      .get(url, { headers: { 'User-Agent': 'YourAppName' } })
      .pipe(
        catchError(() => {
          console.error('Error getting address from coordinates');
          return throwError('');
        })
      )
      .subscribe((response: any) => {
        if (response?.display_name) {
          this.address = response.display_name;
        }
      });
  }

  loadComments(): void {
    console.error(this.crimeAlert?.id);
    this.commentService.query({ crime: this.crimeAlert?.id }).subscribe((res: HttpResponse<IComment[]>) => {
      this.comments = res.body ?? [];
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
