import { StylesFormConfig } from "../../../models";
import { controlsBlueprint, pixChecker, percChecker, bgChecker, borderChecker, shortChecker, shadowChecker, opacityChecker, zoomChecker } from "../checkers";

export const COMMON_STYLES: Array<StylesFormConfig> = [
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
        property: 'background',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, controlChecker: bgChecker}],
        ]
    },
    {
        property: 'border',
        valueTypes: [
            ['shortWithColorPicker', {...controlsBlueprint, controlChecker: borderChecker}],
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
        property: 'padding-left',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: 0, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'padding-top',
        valueTypes: [
            ['percentage', {...controlsBlueprint, minValue: 0, maxValue: 100, controlChecker: percChecker}],
        ]
    },
    {
        property: 'border-radius',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: shortChecker}],
        ]
    },
    {
        property: 'margin',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: shortChecker}],
        ]
    },
    {
        property: 'padding',
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
    {
        property: 'opacity',
        valueTypes: [
            ['percentage', {...controlsBlueprint, controlChecker: opacityChecker, minValue: 0, maxValue: 100}],
        ]
    },
    {
        property: 'zoom',
        valueTypes: [
            ['short', {...controlsBlueprint, controlChecker: zoomChecker}],
        ]
    },
];