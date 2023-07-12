import { Section, SectionsEnum } from "../../../models";
import { COMMON_STYLES } from "./common";
import { FLEXBOX_STYLES } from "./flexbox";
import { GRID_STYLES } from "./grid";

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