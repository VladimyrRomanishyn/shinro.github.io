import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExportService } from '../../../services/export.service';
import { builderFeatureKey, BuilderFeatureState } from '../../../state/builder-feature.reducer';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'builder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [MessageService]
})
export class ToolbarComponent  {
  constructor
  (
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    public exportSvc: ExportService,
    private messageSvc: MessageService
  ) {}

  showExportMessage(): void {
    this.messageSvc.add({severity: 'success', summary: 'Exported!'})
  }
}
