import { StylesFormConfig } from "../../../models";
import { controlsBlueprint, defaultChecker, gapChecker } from "../checkers";
import { displayOpt, fxJusContOpt, fxAlItemsOpt, fxAlContentOpt, fxASOpt } from "../options";

export const GRID_STYLES: Array<StylesFormConfig> = [
    {
        property: 'display',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [displayOpt]}],
        ]
    },
    {
        property: 'grid-template',
        ngStyle: {'grid-row-end': 'span 2', 'height': '162px'},
        valueTypes: [
            ['textarea', {...controlsBlueprint, controlChecker: defaultChecker}],
        ]
    },
    {
        property: 'grid-area',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: defaultChecker}],
        ]
    },
    {
        property: 'justify-content',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxJusContOpt]}],
        ]
    },
    {
        property: 'align-items',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxAlItemsOpt]}],
        ]
    },
    {
        property: 'align-content',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxAlContentOpt]}],
        ]
    },
    {
        property: 'align-self',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxASOpt]}],
        ]
    },
    {
        property: 'justify-self',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxASOpt]}],
        ]
    },
    {
        property: 'gap',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: gapChecker}],
        ]
    },
    {
        property: 'justify-items',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxJusContOpt]}],
        ]
    },
];