// TODO: fix bug with rgb(253, 245, 13) stirng returns invalid prop rgb(253, 245, 221 instead 13)
export const rgba2hex: (rgba: string) => string = (rgbaString: string) => {
    const regex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d|\.\d+|\d\.\d+)\s*)?\)/;
    const [, r, g, b, a] = rgbaString.match(regex)?.map(Number) || [];

    const rgb = (r != null && g != null && b != null)
        ? `${([r, g, b]).reduce((acc, e) => {
            let color = e.toString(16);
            
            if (color.length == 1) {
                color = e < 10 ? 0 + color: color + color;
            }

            return acc + color;
        }, '#')}`
        : null;
    const alpha = (a != null && !isNaN(a)) ? (Math.round(a * 255)).toString(16) : null;

    return rgb
        ? alpha ? `${rgb + alpha}` : rgb
        : rgbaString;
}