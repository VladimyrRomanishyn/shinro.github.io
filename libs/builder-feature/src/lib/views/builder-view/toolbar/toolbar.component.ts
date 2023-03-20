import { Component } from '@angular/core';
import { ExportGenerator } from '../../../classes/export-generator';
import { EDITOR_CLASSNAME } from '../../../constants/class-names';

@Component({
  selector: 'builder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  {
  public export(): void {
    ExportGenerator.generate(document.querySelector(`.${EDITOR_CLASSNAME}`) as HTMLElement);
  }
}
