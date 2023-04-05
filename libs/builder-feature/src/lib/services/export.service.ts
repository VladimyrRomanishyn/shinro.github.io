import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { ExportGenerator } from '../classes/export-generator';
import { EDITOR_CLASSNAME } from '../constants/class-names';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportAsImage(target: HTMLElement = this.getRoot()): void {
    html2canvas(target)
    .then((canvas: HTMLCanvasElement) => {
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = 'image'
      link.href = url;
      link.click()
      link.remove();
    })
  }

  generateExport(internalStyles = false): void {
    ExportGenerator.generateExport(this.getRoot(), internalStyles);
  }

  private getRoot(): HTMLElement {
    return document.querySelector(`.${EDITOR_CLASSNAME}`) as HTMLElement;
  }
}
