import { FormControlsShape } from "../../models";

export const controlsBlueprint = {
    changed: false, value: '',
    update: true, styleValue: '',
    minValue: 0,
    maxValue: 100
};

export const borderChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
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

export const bgChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const colorChanged = control.color !== prevControl.color;
    const valueChanged = control.value !== prevControl.value;
    
    control.changed = colorChanged || valueChanged;
    control.update = colorChanged; 
    control.styleValue = 
        valueChanged ? `${control.value}`:
        colorChanged ? `${control.color}`
                     : `${control.value}`;
};
export const percChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}%` : control.styleValue;
};

export const opacityChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${+control.value / 100}` : control.styleValue;
};

export const pixChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.update = !control.changed;
    control.styleValue = control.changed ? `${control.value}px` : control.styleValue;
};

export const shortChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const regex = /^((-?\d+(.\d+)?(px|pc|em|rm|%)|0) ?){1,4}$/;
    
    if (!regex.test(control.value as string)) { 
        control.update = true;
        return;
    }
    control.changed = control.value !== prevControl.value;
    control.update = false;
    control.styleValue = `${control.value}`;
};

export const shadowChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
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

export const zoomChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
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

export const defaultChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    control.changed = control.value !== prevControl.value;
    control.styleValue = `${control.value}`;
    control.update = !control.changed;
};

export const gapChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /(?:(?:\d+(?:\.\d+)?(?:px|em|rm|%|vmin|cm|vmax|vh|vw|mm)\s?){1,2})/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};

export const orderChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /\d+/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};

export const fxBasisChecker = (control: FormControlsShape, prevControl: FormControlsShape) => {
    const testRegex = /\d+(px|em|rm|%|vh|vw|pc)|auto|(max|min|fit)?-?content/;

    control.changed = testRegex.test(control.value as string) && control.value !== prevControl.value;
    control.styleValue = control.changed ?  `${control.value}` : control.styleValue;
    control.update = !control.changed;
};