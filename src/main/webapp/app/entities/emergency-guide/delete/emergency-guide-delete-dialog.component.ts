import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyGuide } from '../emergency-guide.model';
import { EmergencyGuideService } from '../service/emergency-guide.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emergency-guide-delete-dialog.component.html',
})
export class EmergencyGuideDeleteDialogComponent {
  emergencyGuide?: IEmergencyGuide;

  constructor(protected emergencyGuideService: EmergencyGuideService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyGuideService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
