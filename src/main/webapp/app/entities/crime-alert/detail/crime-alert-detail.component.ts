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
      this.commentService
        .query({ 'crimeAlertId.equals': crimeAlert.id })
        .subscribe((res: HttpResponse<IComment[]>) => (this.comments = res.body ?? []));
      this.getAddressFromCoordinates(crimeAlert.lat, crimeAlert.lon);
    });
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
