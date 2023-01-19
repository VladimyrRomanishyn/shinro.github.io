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

const controlsBlueprint: FormControlsShape = {editable: false, value: null };

const boxModelPage: Array<StylesFormConfig> = [
    {
        property: 'width',
        valueTypes: [
            ['pixels', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint}],
        ]
    },
    {
        property: 'height',
        valueTypes: [
            ['pixels', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint}],
        ]
    },
    {
        property: 'margin',
        valueTypes: [
            ['pixels', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint}],
        ]
    },
    {
        property: 'padding',
        valueTypes: [
            ['pixels', {...controlsBlueprint}],
            ['percentage', {...controlsBlueprint}],
        ]
    },
    {
        property: 'border',
        valueTypes: [
            ['short', {...controlsBlueprint}],
            ['full', {...controlsBlueprint}],
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