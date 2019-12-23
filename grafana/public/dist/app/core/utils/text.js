import xss from 'xss';
var XSSWL = Object.keys(xss.whiteList).reduce(function (acc, element) {
    // @ts-ignore
    acc[element] = xss.whiteList[element].concat(['class', 'style']);
    return acc;
}, {});
var sanitizeXSS = new xss.FilterXSS({
    whiteList: XSSWL,
});
/**
 * Returns string safe from XSS attacks.
 *
 * Even though we allow the style-attribute, there's still default filtering applied to it
 * Info: https://github.com/leizongmin/js-xss#customize-css-filter
 * Whitelist: https://github.com/leizongmin/js-css-filter/blob/master/lib/default.js
 */
export function sanitize(unsanitizedString) {
    try {
        return sanitizeXSS.process(unsanitizedString);
    }
    catch (error) {
        console.log('String could not be sanitized', unsanitizedString);
        return unsanitizedString;
    }
}
export function hasAnsiCodes(input) {
    return /\u001b\[\d{1,2}m/.test(input);
}
export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
//# sourceMappingURL=text.js.map