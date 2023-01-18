import { FormBuilder } from '@angular/forms';
export type CSSProperty =  
| 'width' | 'height' | 'margin' | 'padding' | 'border' ;  

export type ValueType = 'percentage' | 'pixels' | 'short' | 'full';

export type StylesForm =  {
    [key in CSSProperty]: {
        [key in ValueType]: {
            editable: boolean;
            value: string | number;
        }
    };
};

export class StylesFormBuilder extends FormBuilder {
    constructor(private node: HTMLElement) {
        super();
    }
    public  createStylesForm( pattern?: StylesForm) {
        console.log(this.node, pattern);
        return this.group({
            width: 100 })
              
    }
}
