export type CSSProperty =  
| 'width' | 'height' | 'margin' | 'padding' | 'border' ;  

export type ValueType = 'percentage' | 'pixels' | 'short' | 'full';

export type StylesForm =  {
    [key in CSSProperty]: {
        [key in ValueType]: {
            editable: boolean;
            value: string | number;
        }
    };
};
