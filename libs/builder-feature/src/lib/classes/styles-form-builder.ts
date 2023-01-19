import { ThisReceiver } from '@angular/compiler';
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
    private _stylesFormArray!: FormArray;

    get stylesFormArray(): FormArray {
        return this._stylesFormArray;
    }
    constructor(private node: HTMLElement) {
        super();
    }

    public  createStylesForm(config: Array<StylesFormConfig>) {
        this._stylesFormArray =  this.array(config.map((propConfig) => {
            return this.group({
                property: this.array(propConfig.valueTypes.map(
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
            })
             
        }));
    }

    private setPercentage(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        const parent = this.node.parentElement as HTMLElement;
        const parentValue = getComputedStyle(parent).getPropertyValue(property).slice(0, -2)
        const targetValue = getComputedStyle(this.node).getPropertyValue(property).slice(0, -2)
        control.value = +targetValue / +parentValue * 100;
        return this.group(control);
    }

    private setPixels(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        control.value = getComputedStyle(this.node).getPropertyValue(property);
        return this.group(control);
    }

    private setShort(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        control.value = getComputedStyle(this.node).getPropertyValue(property);
        return this.group(control);
    }

    private setFull(property: CSSProperty,type: ValueType, control: FormControlsShape) {
        control.value = getComputedStyle(this.node).getPropertyValue(property);
        return this.group(
            {}
        )
    }
}
