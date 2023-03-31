import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { ExportGenerator } from '../classes/export-generator';
import { EDITOR_CLASSNAME } from '../constants/class-names';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportAsImage(target: HTMLElement = this.getRoot()) {
    html2canvas(target)
    .then((canvas: HTMLCanvasElement) => {
      console.log(canvas);
      const url = canvas.toDataURL();
      const link = document.createElement('a');
      link.download = 'image'
      link.href = url;
      link.click()
      link.remove();
    })
  }

  exportSepateFiles() {
    
    ExportGenerator.generate(this.getRoot());
  }

  private getRoot(): HTMLElement {
    return document.querySelector(`.${EDITOR_CLASSNAME}`) as HTMLElement;
  }
}
