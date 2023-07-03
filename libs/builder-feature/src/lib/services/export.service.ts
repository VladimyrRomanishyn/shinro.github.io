import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { environment } from '../../../../../apps/template-builder/src/environments/environment';
import { ExportGenerator, ExportParams, EDITOR_CLASSNAME } from '@core-tb';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportAsImage(params: Partial<ExportParams>): void {
    params.element = this.getRoot();
    params.electron = environment.electron;
   
    if (params.electron) {
      ExportGenerator.setSavePathElectron();
      ExportGenerator.checkDownloadPath()
        .subscribe(path => {
          if(path && params.messageSvc) {
            this.downloadCanvas(params);
            params.messageSvc.add({severity: 'success', summary: 'Exported' })
          } 
        })
    } else {
      this.downloadCanvas(params);
      
      if (params.messageSvc) {
        params.messageSvc.add({severity: 'success', summary: 'Exported' });
      }
    }
      
  }

  private downloadCanvas(params: Partial<ExportParams>): void {
    html2canvas(params.element as HTMLElement)
        .then((canvas: HTMLCanvasElement) => {
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = params.names && params.names.get('image') as string || '';
          link.href = url;
          link.click()
          link.remove();
      })
  }

  generateExport(params: Partial<ExportParams>): void {
    const exportParams: ExportParams = {
      names: params.names || new Map(),
      messageSvc: params.messageSvc,
      electron: environment.electron,
      fileType: params.fileType || 'internalStyles',
      element: this.getRoot()
    } 

    ExportGenerator.generateExport(exportParams);
  }

  private getRoot(): HTMLElement {
    return document.querySelector(`.${EDITOR_CLASSNAME}`) as HTMLElement;
  }
}
