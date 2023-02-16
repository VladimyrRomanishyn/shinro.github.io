import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export type CSSProperty =
    | 'width' | 'height' | 'margin' | 'padding' | 'border' | 'background';

export type ValueType = 'percentage' | 'pixels' | 'short' | 'shortWithColorPicker';

export type FormControlsShape = {
    editable: boolean[];
    value: (string | boolean | number)[];
    color?: string;
    replacemantCb?: (params: any[]) => any;
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
        [key in ValueType]: FormControlsShape
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
                                    return this.group({ percentage: this.group(this.setPercentage(propConfig.property, control)) });
                                case 'pixels':
                                    return this.group({ pixels: this.group(this.setPixels(propConfig.property, control)) });
                                case 'short':
                                case 'shortWithColorPicker':
                                    return this.group({ short: this.group(this.setShortWithColor(propConfig.property, control)) });
                            }
                        })
                    )
                })

            }))
        });
        this.previousState = { ...this._stylesFormGroup.value };
        this.createFormObserver();
    }

    private createFormObserver(): void {
        const subscription = this._stylesFormGroup.valueChanges
            .pipe(
                map((value: StyleFormValue) => {
                    return value.nodeStyles.reduce((acc, property: StyleFormPropertyValue, i) => {
                        const prevState = this.previousState.nodeStyles[i][this.getPropertyName(i)];
                        property[this.getPropertyName(i)].map((control, j) => {
                            const controlValue = Object.entries(control)[0][1];
                            const prevControlValue = Object.entries(prevState[j])[0][1];

                            if
                            (
                                controlValue?.editable &&
                                (controlValue.value !== prevControlValue.value || controlValue.color !== prevControlValue.color)
                            ) {
                                if (controlValue.replacemantCb) {
                                    controlValue.value = controlValue.replacemantCb([controlValue.value, controlValue.color]);
                                }

                                acc = { changes: property, index: i };

                            }
                        });
                        return acc;
                    }, {} as { changes: StyleFormPropertyValue, index: number })
                }),
                filter(({ changes }) => !!changes)
            )
            .subscribe(({ changes, index }) => {
                this.previousState = { ...this._stylesFormGroup.value };
                const [propertyName, valueTypes] = Object.entries(changes)[0];

                valueTypes.map(vType => {
                    const [, control] = Object.entries(vType)[0];

                    if (control.editable) {
                        this.node.style[propertyName as CSSProperty] = `${control.value}`;
                    }
                })

                const newControl = {
                    [propertyName]: valueTypes.map(vType => {
                        const [valueType, control] = Object.entries(vType)[0];

                        switch (valueType) {
                            case 'percentage':
                                return { percentage: this.setPercentage(propertyName as CSSProperty, control) };
                            case 'pixels':
                                return { pixels: this.setPixels(propertyName as CSSProperty, control) };
                            case 'short':
                                return { short: this.setShort(propertyName as CSSProperty, control) };
                            case 'shortWithColorPicker':
                                return { short: this.setShortWithColor(propertyName as CSSProperty, control) };
                        }

                        return;
                    })
                }
                console.log('newControl:  ', newControl);
                // @ts-ignore
                this._stylesFormGroup.controls['nodeStyles'].controls[index].patchValue(newControl);
            });

        StylesFormBuilder.subscriptions.push(subscription);
    }

    private setPercentage(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        const parent = this.node.parentElement as HTMLElement;
        const parentValue = +getComputedStyle(parent).getPropertyValue(property).slice(0, -2);
        const targetValue = +getComputedStyle(this.node).getPropertyValue(property).slice(0, -2);
        control.value = isFinite(targetValue) && (isFinite(parentValue) && !!parentValue)
            ? [+Math.ceil(targetValue / parentValue * 100).toFixed()]
            : [0];
        return { ...control };
    }

    private setPixels(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        control.value = [getComputedStyle(this.node).getPropertyValue(property).slice(0, -2) || 0];
        control.value = [Math.floor(+control.value)];
        return { ...control };
    }

    private setShort(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        const regex = new RegExp(`${property}:(.+?);`);
        const textValue = this.node?.style?.cssText?.match(regex);
        control.value = textValue ? [textValue[1].trim()] : [getComputedStyle(this.node).getPropertyValue(property)];

        return control;
    }

    private setShortWithColor(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        const newControl = this.setShort(property, control);
        const rgb = getComputedStyle(this.node).getPropertyValue(`${property}-color`);
        newControl.color = this.rgba2hex(rgb);
        
        return newControl;

    }

    private rgba2hex(rgbaString: string): string {
        const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d|\.\d+|\d\.\d+)\s*)?\)/;
        const [, r, g, b, a] = rgbaString.match(regex)?.map(Number) || [];

        const rgb = (r != null && g != null && b != null)
            ? `${([r, g, b]).reduce((acc, e) => {
                let color = e.toString(16);
                
                if (color.length == 1) {
                    color = e < 10 ? 0 + color: color + color;
                }

                return acc + color;
            }, '#')}`
            : null;
        const alpha = (a != null && !isNaN(a)) ? (Math.round(a * 255)).toString(16) : null;

        return rgb
            ? alpha ? `${rgb + alpha}` : rgb
            : rgbaString;
    }

    public static clearSubscriptions(): void {
        StylesFormBuilder.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
