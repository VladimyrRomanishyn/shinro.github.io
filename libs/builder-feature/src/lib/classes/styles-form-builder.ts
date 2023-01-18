import { FormArray, FormBuilder } from '@angular/forms';

export type CSSProperty =  
| 'width' | 'height' | 'margin' | 'padding' | 'border' ;  

export type ValueType = 'percentage' | 'pixels' | 'short' | 'full';

export type FormControlsShape =  {
    editable: boolean;
    value: string | number | null;
};

export type StylesFormConfig = {
    property: CSSProperty,
    valueTypes: Array<[ValueType, FormControlsShape]>
};

export class StylesFormBuilder extends FormBuilder {
    constructor(private node: HTMLElement) {
        super();
    }

    public  createStylesForm(config: Array<StylesFormConfig>): FormArray {
        return this.array(config.map((propConfig) => {
            return this.array(propConfig.valueTypes.map(
                ([type, control]) => {
                    switch(type) {
                        case 'percentage': 
                            return this.setPercentage(propConfig.property, type, control);
                        case 'pixels':
                            return this.setPixels(propConfig.property, type, control);
                        case 'short':
                            return this.setShort(propConfig.property, type, control);
                        case 'full': 
                            return this.setFull(propConfig.property, type, control);            
                    }
                })
            )
        }));
    }

    private setPercentage(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        const parent = this.node.parentElement as HTMLElement;
        const parentWidth = getComputedStyle(parent).getPropertyValue(property).slice(0, -2)
        const width = getComputedStyle(this.node).getPropertyValue(property).slice(0, -2)
        control.value = +width / +parentWidth * 100;
        return this.group(control);
    }

    private setPixels(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        const width = getComputedStyle(this.node).getPropertyValue(property);
        control.value = width;
        return this.group(control);
    }

    private setShort(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        debugger;
        return this.group(
            {}
        )
    }

    private setFull(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        debugger;
        return this.group(
            {}
        )
    }
}
