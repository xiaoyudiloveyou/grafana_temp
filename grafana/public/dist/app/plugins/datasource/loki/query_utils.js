var selectorRegexp = /(?:^|\s){[^{]*}/g;
var caseInsensitive = '(?i)'; // Golang mode modifier for Loki, doesn't work in JavaScript
export function parseQuery(input) {
    input = input || '';
    var match = input.match(selectorRegexp);
    var query = input;
    var regexp = '';
    if (match) {
        regexp = input.replace(selectorRegexp, '').trim();
        // Keep old-style regexp, otherwise take whole query
        if (regexp && regexp.search(/\|=|\|~|!=|!~/) === -1) {
            query = match[0].trim();
            if (!regexp.startsWith(caseInsensitive)) {
                regexp = "" + caseInsensitive + regexp;
            }
        }
        else {
            regexp = '';
        }
    }
    return { regexp: regexp, query: query };
}
export function formatQuery(selector, search) {
    return ((selector || '') + " " + (search || '')).trim();
}
/**
 * Returns search terms from a LogQL query.
 * E.g., `{} |= foo |=bar != baz` returns `['foo', 'bar']`.
 */
export function getHighlighterExpressionsFromQuery(input) {
    var parsed = parseQuery(input);
    // Legacy syntax
    if (parsed.regexp) {
        return [parsed.regexp];
    }
    var expression = input;
    var results = [];
    // Consume filter expression from left to right
    while (expression) {
        var filterStart = expression.search(/\|=|\|~|!=|!~/);
        // Nothing more to search
        if (filterStart === -1) {
            break;
        }
        // Drop terms for negative filters
        var skip = expression.substr(filterStart).search(/!=|!~/) === 0;
        expression = expression.substr(filterStart + 2);
        if (skip) {
            continue;
        }
        // Check if there is more chained
        var filterEnd = expression.search(/\|=|\|~|!=|!~/);
        var filterTerm = void 0;
        if (filterEnd === -1) {
            filterTerm = expression.trim();
        }
        else {
            filterTerm = expression.substr(0, filterEnd).trim();
            expression = expression.substr(filterEnd);
        }
        // Unwrap the filter term by removing quotes
        var quotedTerm = filterTerm.match(/^"((?:[^\\"]|\\")*)"$/);
        if (quotedTerm) {
            var unwrappedFilterTerm = quotedTerm[1];
            results.push(unwrappedFilterTerm);
        }
        else {
            return null;
        }
    }
    return results;
}
//# sourceMappingURL=query_utils.js.map