export default function RunnerPlugin(_a) {
    var handler = _a.handler;
    return {
        onKeyDown: function (event, editor, next) {
            // Handle enter
            if (handler && event.key === 'Enter' && !event.shiftKey) {
                // Submit on Enter
                event.preventDefault();
                handler(event);
                return true;
            }
            return next();
        },
    };
}
//# sourceMappingURL=runner.js.map