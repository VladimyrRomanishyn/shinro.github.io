import { Injectable } from '@angular/core';
import { ExportGenerator } from '../classes/export-generator';
import { EDITOR_CLASSNAME } from '../constants/class-names';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  constructor() { }

  getCSSListing(): string {
    const root = document.querySelector(`.${EDITOR_CLASSNAME}`)?.cloneNode(true) as HTMLElement;
    ExportGenerator.addClassNames(root);
    const listing = ExportGenerator.createRulesList(root);
    root.remove();
    return listing;
  }

  getHTMLListing(): string {
    const root = document.querySelector(`.${EDITOR_CLASSNAME}`)?.cloneNode(true) as HTMLElement;
    ExportGenerator.addClassNames(root);
    const listing = ExportGenerator.reformatHTML(root);
    root.remove();
    return listing
  }
}
