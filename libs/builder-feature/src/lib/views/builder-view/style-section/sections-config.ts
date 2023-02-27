import { FormControlsShape, StylesFormConfig, ValueType } from '../../../classes/styles-form-builder';

export enum SectionsEnum {
    boxModel = 'box-model',
    grid = 'grid',
    flex = 'flex',
}


export interface Section {
    name: string,
    value: SectionsEnum,
    stylesFormCofig: Array<StylesFormConfig>
}

const controlsBlueprint = {changed: false, value: '', update: true, styleValue: '' };

const borderChecker = (control: FormControlsShape, prevControl: any) => {
    const [,bWidth, bStyle] = Array.from((control.value as string).match(/(\S+)\s+(\S+)/) || []);
    control.update = false;
    `${bWidth} ${bStyle} ${control.color}`;
}

const bgChecker = (control: FormControlsShape, prevControl: any) => {
    control.update = false;
    control.color || '';
};
const percChecker = (control: FormControlsShape, prevControl: any) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}%` : control.styleValue;
};

const pixChecker = (control: FormControlsShape, prevControl: any) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}px` : control.styleValue;
};

const shortChecker = (control: FormControlsShape, prevControl: any) => {
    const regex = /^((\d+(px|pc|em|rm|%)|0) ?){1,4}$/;
    // const regex = /^\d+(px|pc|em|rm|%)($|( \d+(px|pc|em|rm|%)){1,3}$)/;
    if (!regex.test(control.value as string)) { 
        control.update = true;
        return;
    }
    control.changed = control.value !== prevControl.value;
    control.update = false;
    control.styleValue = `${control.value}`;
};

const boxModelPage: Array<StylesFormConfig> = [
    {
        property: 'width',
        valueTypes: [
            ['pixels', {...controlsBlueprint, controlChecker: pixChecker}],
            ['percentage', {...controlsBlueprint, controlChecker: percChecker}],
        ]
    },
    {
        property: 'height',
        valueTypes: [
            ['pixels', {...controlsBlueprint, controlChecker: pixChecker}],
            ['percentage', {...controlsBlueprint, controlChecker: percChecker}],
        ]
    },
    {
        property: 'margin',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: shortChecker}],
            ['percentage', {...controlsBlueprint, controlChecker: percChecker}],
        ]
    },
    /*{
        property: 'padding',
        valueTypes: [
            ['short', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint, replacemantCb: percentageRepCb}],
        ]
    },
    {
        property: 'border',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, replacemantCb: borderRepCb}],
        ]
    },
    {
        property: 'background',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, replacemantCb: bgRepCb}],
        ]
    },
    {
        property: 'border-radius',
        valueTypes: [
            ['short', {...controlsBlueprint}],
        ]
    },
    {
        property: 'box-shadow',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, replacemantCb: bgRepCb}],
        ]
    },*/
]

export const sectionsCofig: Section[] = [
    {
        name: 'Box Model, Positioning',
        value: SectionsEnum.boxModel,
        stylesFormCofig: boxModelPage
    },
    {
        name: 'Grid',
        value: SectionsEnum.grid,
        stylesFormCofig: boxModelPage
    },
    {
        name: 'Flex',
        value: SectionsEnum.flex,
        stylesFormCofig: boxModelPage
    },
]