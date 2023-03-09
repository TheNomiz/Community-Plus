import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILostFoundPage } from '../lost-found-page.model';
import { LostFoundPageService } from '../service/lost-found-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './lost-found-page-delete-dialog.component.html',
})
export class LostFoundPageDeleteDialogComponent {
  lostFoundPage?: ILostFoundPage;

  constructor(protected lostFoundPageService: LostFoundPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lostFoundPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
