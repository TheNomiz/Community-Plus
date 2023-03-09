import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyGuidePage } from '../emergency-guide-page.model';
import { EmergencyGuidePageService } from '../service/emergency-guide-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emergency-guide-page-delete-dialog.component.html',
})
export class EmergencyGuidePageDeleteDialogComponent {
  emergencyGuidePage?: IEmergencyGuidePage;

  constructor(protected emergencyGuidePageService: EmergencyGuidePageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyGuidePageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
