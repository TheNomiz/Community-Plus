import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICrimeAlert } from '../crime-alert.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { HttpResponse } from '@angular/common/http'; // Import the Comment model
@Component({
  selector: 'jhi-crime-alert-detail',
  templateUrl: './crime-alert-detail.component.html',
})
export class CrimeAlertDetailComponent implements OnInit {
  crimeAlert: ICrimeAlert | null = null;
  comments: IComment[] = []; // Add a property to store the comments

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private commentService: CommentService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crimeAlert }) => {
      this.crimeAlert = crimeAlert;
      this.loadComments(); // Load the comments when the crime alert is loaded
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
