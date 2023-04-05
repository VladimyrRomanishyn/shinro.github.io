import { Pipe, PipeTransform } from '@angular/core';
import { EDITOR_CLASSNAME } from '../constants/class-names';

@Pipe({
  name: 'checkEditorContent',
  pure: false
})
export class CheckEditorContentPipe implements PipeTransform {
  transform(name: string): boolean {
    return !!document.querySelector(`.${EDITOR_CLASSNAME}`)?.innerHTML;
  }
}
