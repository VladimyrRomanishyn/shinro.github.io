import { Injectable } from '@angular/core';
import { ExportGenerator, EDITOR_CLASSNAME } from '@core-tb';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  getCSSListing(dataId = true): string {
    const root = document.querySelector(`.${EDITOR_CLASSNAME}`)?.cloneNode(true) as HTMLElement;
    ExportGenerator.addClassNames(root);
    const listing = ExportGenerator.createRulesList(root, dataId);
    root.remove();
    return listing;
  }


  getHTMLListing(dataId = true): string {
    const root = document.querySelector(`.${EDITOR_CLASSNAME}`)?.cloneNode(true) as HTMLElement;
    ExportGenerator.addClassNames(root);
    const whiteList = dataId ? ['data-id'] : [];
    const listing = ExportGenerator.reformatHTML(root, whiteList);
    root.remove();
    return listing
  }

  setClassNames(el: HTMLElement): void {
    ExportGenerator.addClassNames(el, false);
  }
}
