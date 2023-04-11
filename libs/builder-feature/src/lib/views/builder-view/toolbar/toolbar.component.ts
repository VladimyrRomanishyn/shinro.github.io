import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExportService } from '../../../services/export.service';
import { builderFeatureKey, BuilderFeatureState } from '../../../state/builder-feature.reducer';

@Component({
  selector: 'builder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent  {
  constructor
  (
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    public exportSvc: ExportService
  ) {}
}
