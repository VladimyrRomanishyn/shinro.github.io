import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { builderFeatureKey, BuilderFeatureState } from '../../state/builder-feature.reducer';

@Component({
  selector: 'export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
  @Output() exportGenerated: EventEmitter<void> = new EventEmitter();
  public exportTypes!: {exportType: string, exportLabel: string}[];
  public exportType: string | undefined;
  constructor
  (
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    public exportSvc: ExportService
  ) {}

  public exportImage(): void {
    this.store.select(state => state[builderFeatureKey].target)
      .pipe(first())
      .subscribe((target: HTMLElement | undefined) => {
        this.exportSvc.exportAsImage(target);
      })
    
  }

  public generateExport(): void {
    switch(this.exportType) {
      case 'Image': 
        this.exportImage();
        break;

      case 'Separate': 
        this.exportSvc.generateExport();
        break;
      
      case 'Internal':
        this.exportSvc.generateExport(true);
        break;  
    }

    this.exportGenerated.emit();
  }

  ngOnInit(): void {
    this.exportTypes = [
      { exportType: 'Separate', exportLabel: 'Separate HTML and CSS files'},
      { exportType: 'Internal', exportLabel: 'HTML file with internal styling'},
      { exportType: 'Image', exportLabel: 'PNG image'},
    ]
  }
}
