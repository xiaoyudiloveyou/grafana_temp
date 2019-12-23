// based on http://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
function outlineFixer() {
    var d = document;
    var styleElement = d.createElement('STYLE');
    var domEvents = 'addEventListener' in d;
    var addEventListener = function (type, callback) {
        // Basic cross-browser event handling
        if (domEvents) {
            d.addEventListener(type, callback);
        }
        else {
            d.attachEvent('on' + type, callback);
        }
    };
    var setCss = function (cssText) {
        // Handle setting of <style> element contents in IE8
        !!styleElement.styleSheet ? (styleElement.styleSheet.cssText = cssText) : (styleElement.innerHTML = cssText);
    };
    d.getElementsByTagName('HEAD')[0].appendChild(styleElement);
    // Using mousedown instead of mouseover, so that previously focused elements don't lose focus ring on mouse move
    addEventListener('mousedown', function () {
        setCss(':focus{outline:0 !important}::-moz-focus-inner{border:0;}');
    });
    addEventListener('keydown', function () {
        setCss('');
    });
}
outlineFixer();
//# sourceMappingURL=outline.js.map