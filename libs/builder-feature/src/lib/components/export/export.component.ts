import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { Store } from '@ngrx/store';
import { builderFeatureKey, BuilderFeatureState } from '../../state/builder-feature.reducer';
import { MessageService } from 'primeng/api';
import { ExportConfig, ExportMapKey, ExportMapValue } from '../../constants/export-blueprints';

@Component({
  selector: 'export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input() messageSvc!: MessageService;
  @Output() exportGenerated: EventEmitter<void> = new EventEmitter();
  public exportTypes!: [ExportMapKey, ExportMapValue][];
  public exportType: string | undefined;
  constructor
  (
    //private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    public exportSvc: ExportService
  ) {}

  public generateExport(): void {
    const names = this.getFileNames();

    switch(this.exportType) {
      case 'Image': 
        this.exportSvc.exportAsImage(this.messageSvc, names);
        break;

      case 'Separate': 
        this.exportSvc.generateExport(this.messageSvc, names);
        break;
      
      case 'Internal':
        this.exportSvc.generateExport(this.messageSvc, names, true);
        break;  
    }
    
    this.exportGenerated.emit();
  }

  getFileNames() {
    return new Map(this.exportTypes.filter(i => i[0] === this.exportType)[0][1]
      .fileNames
      .map(([key, value]) => {
        return [key, value.name.trim() + value.ext];
      })
    );
  }

  nameChange(event: FocusEvent, fileName: string): void {
    const file = this.exportTypes.filter(i => i[0] === this.exportType)[0][1]
      .fileNames
      .filter(([key]) => key === fileName)[0][1];
    // @ts-ignore
    file.name = event.target?.innerHTML;
  }

  ngOnInit(): void {
    this.exportTypes = Array.from(ExportConfig.entries());
  }
}
