import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILostFound } from '../lost-found.model';
import { LostFoundService } from '../service/lost-found.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './lost-found-delete-dialog.component.html',
})
export class LostFoundDeleteDialogComponent {
  lostFound?: ILostFound;

  constructor(protected lostFoundService: LostFoundService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lostFoundService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
