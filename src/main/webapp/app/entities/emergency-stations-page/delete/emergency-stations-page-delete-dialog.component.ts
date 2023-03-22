import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyStationsPage } from '../emergency-stations-page.model';
import { EmergencyStationsPageService } from '../service/emergency-stations-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emergency-stations-page-delete-dialog.component.html',
})
export class EmergencyStationsPageDeleteDialogComponent {
  emergencyStationsPage?: IEmergencyStationsPage;

  constructor(protected emergencyStationsPageService: EmergencyStationsPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyStationsPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
