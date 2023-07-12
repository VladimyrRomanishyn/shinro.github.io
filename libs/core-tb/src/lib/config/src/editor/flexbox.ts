import { StylesFormConfig } from "../../../models";
import { controlsBlueprint, defaultChecker, gapChecker, orderChecker, fxBasisChecker } from "../checkers";
import { displayOpt, fxDirectionOpt, fxWrapOpt, fxJusContOpt, fxAlItemsOpt, fxAlContentOpt, fxASOpt } from "../options";

export const FLEXBOX_STYLES: Array<StylesFormConfig> = [
    {
        property: 'display',
        valueTypes: [
            ['dropdown', { ...controlsBlueprint, controlChecker: defaultChecker, options: [displayOpt]}],
        ]
    },
    {
        property: 'flex-direction',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxDirectionOpt]}],
        ]
    },
    {
        property: 'flex-wrap',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [fxWrapOpt]}],
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
        property: 'gap',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: gapChecker}],
        ]
    },
    {
        property: 'order',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: orderChecker}],
        ]
    },
    {
        property: 'flex-grow',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: orderChecker}],
        ]
    },
    {
        property: 'flex-shrink',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: orderChecker}],
        ]
    },
    {
        property: 'flex-basis',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: fxBasisChecker}],
        ]
    },
];