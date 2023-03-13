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

const opacityChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${+control.value / 100}` : control.styleValue;
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
    const inputRegex = /(^(inherit|none|initial|revert(-layer)?|unset)$)|(\d+px|inset)((\s-?\d+(px|rm|em|pc|%|)){1,3})\s(?<color>(rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+(\.\d+)?\))|(\b\w+\b))/;
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
    control.value = control.styleValue;                               

};

const zoomChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
  const testRegex = /normal|reset|inherit|initial|revert(-layer)?|unset|\d*(\.\d*|%)?/;
  
  if (testRegex.test(control.value as string) && control.value !== prevControl.value) {
    control.update = false;
    control.changed = true;
    control.styleValue = `${control.value}`;
  } else {
    control.update = true;
    control.changed = false;
  }
};

const defaultChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.styleValue = `${control.value}`;
    control.update = !control.changed;
};

const gapChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /(?:(?:\d+(?:\.\d+)?(?:px|em|rm|%|vmin|cm|vmax|vh|vw|mm)\s?){1,2})/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};

const orderChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /\d+/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};

const fxBasisChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /\d+(px|em|rm|%|vh|vw|pc)|auto|(max|min|fit)?-?content/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};

const displayOpt: string[] = [
    'block',
    'grid',
    'flex',
    'none',
    'inline-block',
    'inline-flex',
    'inline-grid'
];

const fxDirectionOpt: string[] = [
    'row',
    'row-reverse',
    'column',
    'column-reverse',
];

const fxWrapOpt: string[] = [
    'wrap',
    'wrap-reverse',
    'nowrap'
];

const fxJusContOpt: string[] = [
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
    'normal',
    'center',
    'start',
    'end',
    'flex-start',
    'flex-end',
    'left',
    'right'
];

const fxAlItemsOpt: string[] = [
    'center',
    'start',
    'end',
    'flex-start',
    'flex-end',
    'self-start',
    'self-end',
    'stretch',
    'normal',
    'baseline'
];

const fxAlContentOpt: string[] = [
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
    'normal',
    'center',
    'start',
    'end',
    'flex-start',
    'flex-end',
];

const fxASOpt: string[] = [
 'auto',
 'normal',
 'center',
 'start',
 'end',
 'self-start',
 'self-end',
 'flex-start',
 'flex-end',
 'baseline',
 'first baseline',
 'last baseline',
 'stretch',
 'safe center',
 'unsafe center'
];


const COMMON_STYLES: Array<StylesFormConfig> = [
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

const FLEXBOX_STYLES: Array<StylesFormConfig> = [
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

const GRID_STYLES: Array<StylesFormConfig> = [
    {
        property: 'display',
        valueTypes: [
            ['dropdown', {...controlsBlueprint, controlChecker: defaultChecker, options: [displayOpt]}],
        ]
    },
    {
        property: 'grid-template',
        ngStyle: {'grid-row-end': 'span 2'},
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

export const sectionsCofig: Section[] = [
    {
        name: 'Common',
        value: SectionsEnum.common,
        stylesFormCofig: COMMON_STYLES
    },
    {
        name: 'Flexbox',
        value: SectionsEnum.flexbox,
        stylesFormCofig: FLEXBOX_STYLES
    },
    {
        name: 'Grid',
        value: SectionsEnum.grid,
        stylesFormCofig: GRID_STYLES
    },
]