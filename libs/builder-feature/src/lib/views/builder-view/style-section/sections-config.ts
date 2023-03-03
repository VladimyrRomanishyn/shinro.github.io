import { FormControlsShape, Section, SectionsEnum, StylesFormConfig } from '../../../types/form-types';

const controlsBlueprint = {
    changed: false, value: '',
    update: true, styleValue: '',
    minValue: 0,
    maxValue: 100
};

const borderChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const inputRegex = /^(\d+(px|pc|em|rm|%))|0 ?(\b\S+\b)+$/;
    const inputValid = inputRegex.test(control.value as string);
    const colorChanged = control.color !== prevControl.color;
    const valueChanged = control.value !== prevControl.value;
    const [,bWidth, bStyle] = Array.from((control.value as string).match(/(\S+)\s+(\S+)/) || []);
    
    control.changed = colorChanged || (valueChanged && inputValid);
    control.update = colorChanged; 
    control.styleValue = 
        valueChanged && inputValid ? `${control.value}`:
        colorChanged               ? `${bWidth} ${bStyle} ${control.color}`
                                   : `${control.value}`;
}

const bgChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const colorChanged = control.color !== prevControl.color;
    const valueChanged = control.value !== prevControl.value;
    
    control.changed = colorChanged || valueChanged;
    control.update = colorChanged; 
    control.styleValue = 
        valueChanged ? `${control.value}`:
        colorChanged ? `${control.color}`
                     : `${control.value}`;
};
const percChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}%` : control.styleValue;
};

const pixChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}px` : control.styleValue;
};

const shortChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const regex = /^((-?\d+(.\d+)?(px|pc|em|rm|%)|0) ?){1,4}$/;
    
    if (!regex.test(control.value as string)) { 
        control.update = true;
        return;
    }
    control.changed = control.value !== prevControl.value;
    control.update = false;
    control.styleValue = `${control.value}`;
};

const shadowChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const inputRegex = /(^(inherit|none|initial|revert(-layer)?|unset)$)|(^\d+px|inset)((\s-?\d+(px|rm|em|pc|%|)){1,3})\s(?<color>(rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+(\.\d+)?\))|(\b\w+\b))/;
    const colorReplaceRegex = /rgba?\(\s*?\d+\s*,\s*?\d+\s*,\s*?\d+\s*(,\s*?\d+\.\d+)?\)|\b(?!inset)[a-z-]+(?!px|em|rm|pc|%)\b/;
    const inputValid = inputRegex.test(control.value as string);
    const colorChanged = control.color !== prevControl.color;
    const valueChanged = control.value !== prevControl.value;
    const colorValue = colorReplaceRegex.test(control.value as string);
    control.changed = colorChanged || (valueChanged && inputValid);
    control.update = colorChanged; 
    control.styleValue = 
        valueChanged && inputValid ? `${control.value}`:
        colorChanged && colorValue ? `${control.value}`.replace(colorReplaceRegex, `${control.color}`):
        colorChanged               ? `${control.value} ${control.color}`
                                   : `${control.value}`;

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
        ]
    },
    {
        property: 'margin-left',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: -100, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'margin-top',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: -100, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'padding',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: shortChecker}],
        ]
    },
    {
        property: 'padding-left',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: -100, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'padding-top',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: -100, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'border',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, controlChecker: borderChecker}],
        ]
    },
    {
        property: 'background',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, controlChecker: bgChecker}],
        ]
    },
    {
        property: 'border-radius',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: shortChecker}],
        ]
    },
    {
        property: 'box-shadow',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, controlChecker: shadowChecker}],
        ]
    },
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