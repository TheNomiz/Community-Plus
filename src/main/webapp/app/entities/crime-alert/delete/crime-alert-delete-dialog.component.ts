import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICrimeAlert } from '../crime-alert.model';
import { CrimeAlertService } from '../service/crime-alert.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './crime-alert-delete-dialog.component.html',
})
export class CrimeAlertDeleteDialogComponent {
  crimeAlert?: ICrimeAlert;

  constructor(protected crimeAlertService: CrimeAlertService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.crimeAlertService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
