import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { ExportGenerator } from '../classes/export-generator';
import { EDITOR_CLASSNAME } from '../constants/class-names';
import { environment } from '../../../../../apps/template-builder/src/environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportAsImage(messageSvc: MessageService, names: Map<string,string>, target: HTMLElement = this.getRoot(), electron = environment.electron): void {

    if (electron) {
      ExportGenerator.setSavePathElectron();
      ExportGenerator.checkDownloadPath()
        .subscribe(path => {
          if(path) {
            this.downloadCanvas(target, names);
            messageSvc.add({severity: 'success', summary: 'Exported' })
          } 
        })
    } else {
      this.downloadCanvas(target, names);
      messageSvc.add({severity: 'success', summary: 'Exported' });
    }
      
  }

  private downloadCanvas(target: HTMLElement, names: Map<string,string>): void {
    html2canvas(target)
        .then((canvas: HTMLCanvasElement) => {
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = names.get('image') as string;
          link.href = url;
          link.click()
          link.remove();
      })
  }

  generateExport(messageSvc: MessageService, names: Map<string, string>, internalStyles = false): void {
    ExportGenerator.generateExport(this.getRoot(), names, internalStyles, environment.electron, messageSvc);
  }

  private getRoot(): HTMLElement {
    return document.querySelector(`.${EDITOR_CLASSNAME}`) as HTMLElement;
  }
}
