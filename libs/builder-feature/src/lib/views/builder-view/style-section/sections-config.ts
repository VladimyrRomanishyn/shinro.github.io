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

const controlsBlueprint: FormControlsShape = {editable: false, value: '' };

const borderRepCb = ([value, color]: string[]) => {
    const [,bWidth, bStyle] = Array.from(value.match(/(\S+)\s+(\S+)/) || []);

    return `${bWidth} ${bStyle} ${color}`;
}

const bgRepCb = ([,color]: string[]) => color;
const percentageRepCb = ([value]: string[]) => (value + '%');
const pixelsRepCb = ([value]: string[]) => (value + 'px');

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