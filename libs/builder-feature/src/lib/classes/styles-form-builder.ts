import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StylesFormConfig, StyleFormValue, CSSProperty, ValueType, StyleFormPropertyValue, FormControlsShape } from '../types/form-types';
import { rgba2hex } from '../utils/rgba2hex';



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
                                    return this.group({ short: this.group(this.setShort(propConfig.property, control)) });
                                case 'shortWithColorPicker':
                                    return this.group({ short: this.group(this.setShortWithColor(propConfig.property, control)) });
                                case 'dropdown':
                                    return this.group({ dropdown: this.group(this.setDropdown(propConfig.property, control)) });
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
                            controlValue.controlChecker(controlValue, prevControlValue);

                            if (controlValue.changed) {
                                acc = { changes: property, index: i };
                            }
                        });
                        return acc;
                    }, {} as { changes: StyleFormPropertyValue, index: number })
                }),
                filter(({ changes }) => !!changes)
            )
            .subscribe(({ changes, index }) => {
                console.log('Changes:  ',changes);
                this.previousState = { ...this._stylesFormGroup.value };
                const [propertyName, valueTypes] = Object.entries(changes)[0];

                valueTypes.map(vType => {
                    const [, control] = Object.entries(vType)[0];
                   
                    if (control.changed) {
                        this.node.style[propertyName as any] = control.styleValue;
                    }  
                })

                const newControl = {
                    [propertyName]: valueTypes.map(vType => {
                        const [valueType, control] = Object.entries(vType)[0];
                        
                        if (!control.update) {
                            return {valueType: control};
                        };

                        switch (valueType) {
                            case 'percentage':
                                return { percentage: this.setPercentage(propertyName as CSSProperty, control) };
                            case 'pixels':
                                return { pixels: this.setPixels(propertyName as CSSProperty, control) };
                            case 'short':
                                return { short: this.setShort(propertyName as CSSProperty, control) };
                            case 'shortWithColorPicker':
                                return { short: this.setShortWithColor(propertyName as CSSProperty, control) };
                            case 'dropdown':
                                return { short: this.setDropdown(propertyName as CSSProperty, control) };    
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
        // @ts-ignore
        const styleTextValue = this.node.style[property as string] ? this.node.style[property as string].replace(/(?!-)\D/, '') : null
        const calcValue = isFinite(targetValue) && (isFinite(parentValue) && !!parentValue)
            ? +Math.ceil(targetValue / parentValue * 100).toFixed()
            : 0;
        control.value = styleTextValue ?? calcValue;
        return { ...control };
    }

    private setPixels(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        control.value = getComputedStyle(this.node).getPropertyValue(property).slice(0, -2) || 0;
        control.value = Math.floor(+control.value);
        return { ...control };
    }

    private setDropdown(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        control.value = getComputedStyle(this.node).getPropertyValue(property);
        return { ...control };
    }    

    private setShort(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        const regex = new RegExp(`${property}:(.+?);`);
        const textValue = this.node?.style?.cssText?.match(regex);
        control.value = textValue ? textValue[1].trim() : getComputedStyle(this.node).getPropertyValue(property);

        return control;
    }

    private setShortWithColor(property: CSSProperty, control: FormControlsShape): FormControlsShape {
        const newControl = this.setShort(property, control);
        const rgb = getComputedStyle(this.node).getPropertyValue(`${property}-color`);
        newControl.color = rgba2hex(rgb);
        
        return newControl;

    }

    public static clearSubscriptions(): void {
        StylesFormBuilder.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
