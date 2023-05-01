import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyStations } from '../emergency-stations-db.model';
import { EmergencyStationsDbService } from '../service/emergency-stations-db.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emergency-stations-db-delete-dialog.component.html',
})
export class EmergencyStationsDbDeleteDialogComponent {
  emergencyStations?: IEmergencyStations;

  constructor(protected emergencyStationsService: EmergencyStationsDbService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyStationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
