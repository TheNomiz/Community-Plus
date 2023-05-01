import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyStations } from '../emergency-stations.model';
import { EmergencyStationsService } from '../service/emergency-stations.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emergency-stations-delete-dialog.component.html',
})
export class EmergencyStationsDeleteDialogComponent {
  emergencyStations?: IEmergencyStations;

  constructor(protected emergencyStationsService: EmergencyStationsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyStationsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
