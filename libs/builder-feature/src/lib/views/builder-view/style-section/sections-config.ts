import { FormControlsShape, StylesFormConfig } from '../../../classes/styles-form-builder';

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

const controlsBlueprint: FormControlsShape = {editable: false, value: '', update: true };

const borderRepCb = (control: FormControlsShape) => {
    const [,bWidth, bStyle] = Array.from((control.value as string).match(/(\S+)\s+(\S+)/) || []);
    control.update = false;
    return `${bWidth} ${bStyle} ${control.color}`;
}

const bgRepCb = (control: FormControlsShape) => {
    control.update = false;
    return control.color || '';
};
const percentageRepCb = (control: FormControlsShape) => (control.value + '%') || '';
const pixelsRepCb = (control: FormControlsShape) => (control.value + 'px') || '';

const boxModelPage: Array<StylesFormConfig> = [
    {
        property: 'width',
        valueTypes: [
            ['pixels', {...controlsBlueprint, replacemantCb: pixelsRepCb}],
            ['percentage', {...controlsBlueprint, replacemantCb: percentageRepCb}],
        ]
    },
    {
        property: 'height',
        valueTypes: [
            ['pixels', {...controlsBlueprint, replacemantCb: pixelsRepCb}],
            ['percentage', {...controlsBlueprint, replacemantCb: percentageRepCb}],
        ]
    },
    {
        property: 'margin',
        valueTypes: [
            ['short', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint, replacemantCb: percentageRepCb}],
        ]
    },
    {
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