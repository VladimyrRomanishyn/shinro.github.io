import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { MessageService } from 'primeng/api';
import { ExportConfig, ExportMapKey, ExportMapValue } from '../../constants/export-blueprints';
import { ExportParams } from '../../classes/export-generator';

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
    public exportSvc: ExportService
  ) {}

  public generateExport(): void {
    const params: Partial<ExportParams> = {
      names: this.getFileNames(),
      messageSvc: this.messageSvc
    };
    switch(this.exportType) {
      case 'Image': 
        this.exportSvc.exportAsImage(params);
        break;

      case 'Separate': 
        params.fileType = 'separate';
        this.exportSvc.generateExport(params);
        break;
      
      case 'Internal':
        params.fileType = 'internalStyles';
        this.exportSvc.generateExport(params);
        break;  
      case 'Angular':
        params.fileType = 'Angular';
        this.exportSvc.generateExport(params);
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
