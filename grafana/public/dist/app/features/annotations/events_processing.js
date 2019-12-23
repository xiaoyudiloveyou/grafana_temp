import _ from 'lodash';
export function dedupAnnotations(annotations) {
    var dedup = [];
    // Split events by annotationId property existence
    var events = _.partition(annotations, 'id');
    var eventsById = _.groupBy(events[0], 'id');
    dedup = _.map(eventsById, function (eventGroup) {
        if (eventGroup.length > 1 && !_.every(eventGroup, isPanelAlert)) {
            // Get first non-panel alert
            return _.find(eventGroup, function (event) {
                return event.eventType !== 'panel-alert';
            });
        }
        else {
            return _.head(eventGroup);
        }
    });
    dedup = _.concat(dedup, events[1]);
    return dedup;
}
function isPanelAlert(event) {
    return event.eventType === 'panel-alert';
}
//# sourceMappingURL=events_processing.js.map