import { FormBuilder, FormGroup } from '@angular/forms';

export type CSSProperty =
    | 'width' | 'height' | 'margin' | 'padding' | 'border';

export type ValueType = 'percentage' | 'pixels' | 'short' | 'full';

export type FormControlsShape = {
    editable: boolean[];
    value: any[];
};

export type StylesFormConfig = {
    property: CSSProperty,
    valueTypes: Array<[ValueType, FormControlsShape]>
};

export class StylesFormBuilder extends FormBuilder {
    private _stylesFormGroup!: FormGroup;
    private config!: Array<StylesFormConfig>;

    get stylesFormGroup(): FormGroup {
        return this._stylesFormGroup;
    }

    constructor(private node: HTMLElement) {
        super();
    }

    getPropertyName(index: number): string {
        return this.config[index].property;
    }

    getValueTypeName(propIndex: number, valueTypeIndex: number): string {
        return this.config[propIndex].valueTypes[valueTypeIndex][0];
    }

    public createStylesForm(config: Array<StylesFormConfig>) {
        this.config = config;
        this._stylesFormGroup = this.group({
            nodeStyles: this.array(config.map((propConfig) => {
                return this.group({
                    [propConfig.property]: this.array(propConfig.valueTypes.map(
                        ([type, control]) => {
                            switch (type) {
                                case 'percentage':
                                    return this.group({ percentage: this.setPercentage(propConfig.property, type, control) });
                                case 'pixels':
                                    return this.group({ pixels: this.setPixels(propConfig.property, type, control) });
                                case 'short':
                                    return this.group({ short: this.setShort(propConfig.property, type, control) });
                                case 'full':
                                    return this.group({ full: this.setFull(propConfig.property, type, control) });
                            }
                        })
                    )
                })

            }))
        });
    }

    private setPercentage(property: CSSProperty, type: ValueType, control: FormControlsShape): FormGroup {
        const parent = this.node.parentElement as HTMLElement;
        const parentValue = +getComputedStyle(parent).getPropertyValue(property).slice(0, -2);
        const targetValue = +getComputedStyle(this.node).getPropertyValue(property).slice(0, -2);
        control.value = isFinite(targetValue) && (isFinite(parentValue) && !!parentValue)
         ? [Math.ceil(targetValue / parentValue * 100).toFixed()]
         : [0];
        return this.group({...control});
    }

    private setPixels(property: CSSProperty, type: ValueType, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property).slice(0, -2) || 0];
        return this.group({...control});
    }

    private setShort(property: CSSProperty, type: ValueType, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property)];
        return this.group({...control});
    }

    private setFull(property: CSSProperty, type: ValueType, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property)];
        return this.group({...control});
    }
}
