import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

export type CSSProperty =
    | 'width' | 'height' | 'margin' | 'padding' | 'border';

export type ValueType = 'percentage' | 'pixels' | 'short' | 'full' | 'shortWithColorPicker';

export type FormControlsShape = {
    editable: boolean[];
    value: (string | boolean | number)[];
};

export type StylesFormConfig = {
    property: CSSProperty,
    valueTypes: Array<[ValueType, FormControlsShape]>
};

export type StyleFormValue = {
    nodeStyles: Array<StyleFormPropertyValue>
};

export type StyleFormPropertyValue = {
    [key in CSSProperty]: Array<{
        [key in ValueType] : FormControlsShape
    }>
}

export class StylesFormBuilder extends FormBuilder {
    private _stylesFormGroup!: FormGroup;
    private config!: Array<StylesFormConfig>;
    private previousState!: StyleFormValue;
    private static subscriptions: Subscription[] = [];

    get stylesFormGroup(): FormGroup {
        return this._stylesFormGroup;
    }

    constructor(private node: HTMLElement) {
        super();
    }

    getPropertyName(index: number): CSSProperty {
        return this.config[index].property;
    }

    getValueTypeName(propIndex: number, valueTypeIndex: number): ValueType {
        return this.config[propIndex].valueTypes[valueTypeIndex][0];
    }

    public createStylesForm(config: Array<StylesFormConfig>) {
        StylesFormBuilder.clearSubscriptions();
        this.config = config;
        
        this._stylesFormGroup = this.group({
            nodeStyles: this.array(config.map((propConfig) => {
                return this.group({
                    [propConfig.property]: this.array(propConfig.valueTypes.map(
                        ([type, control]) => {
                            switch (type) {
                                case 'percentage':
                                    return this.group({ percentage: this.setPercentage(propConfig.property, control) });
                                case 'pixels':
                                    return this.group({ pixels: this.setPixels(propConfig.property, control) });
                                case 'short':
                                case 'shortWithColorPicker':
                                    return this.group({ short: this.setShort(propConfig.property, control) });
                                case 'full':
                                    return this.group({ full: this.setFull(propConfig.property, control) });
                            }
                        })
                    )
                })

            }))
        });
        this.previousState = {...this._stylesFormGroup.value};
        this.createFormObserver();
    }

    private createFormObserver(): void {
        const subscription = this._stylesFormGroup.valueChanges
            .pipe(
                map((value: StyleFormValue) => {
                    return value.nodeStyles.filter((property: StyleFormPropertyValue, i: number) => {
                        let changed = false;
                        const prevState = this.previousState.nodeStyles[i][this.getPropertyName(i)];
                        property[this.getPropertyName(i)].map((control, j) => {
                            const controlValue = Object.entries(control)[0][1];
                            const prevControlValue = Object.entries(prevState[j])[0][1];

                            if(controlValue?.editable && controlValue.value !== prevControlValue.value) {
                                changed = true;
                            }
                        });

                        return changed;
                    })
                }),
                filter(changes => !!changes.length),
                debounceTime(250)
            )
            .subscribe((v) => {
                this.previousState = {...this._stylesFormGroup.value};
                console.log(v);
            });

        StylesFormBuilder.subscriptions.push(subscription);
    }

    private setPercentage(property: CSSProperty, control: FormControlsShape): FormGroup {
        const parent = this.node.parentElement as HTMLElement;
        const parentValue = +getComputedStyle(parent).getPropertyValue(property).slice(0, -2);
        const targetValue = +getComputedStyle(this.node).getPropertyValue(property).slice(0, -2);
        control.value = isFinite(targetValue) && (isFinite(parentValue) && !!parentValue)
            ? [Math.ceil(targetValue / parentValue * 100).toFixed()]
            : [0];
        return this.group({ ...control });
    }

    private setPixels(property: CSSProperty, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property).slice(0, -2) || 0];
        return this.group({ ...control });
    }

    private setShort(property: CSSProperty, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property)];
        return this.group({ ...control });
    }

    private setFull(property: CSSProperty, control: FormControlsShape): FormGroup {
        control.value = [getComputedStyle(this.node).getPropertyValue(property)];
        return this.group({ ...control });
    }

    public static clearSubscriptions(): void {
        StylesFormBuilder.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
