import { VizOrientation } from '@grafana/ui';
import { ReducerID } from '@grafana/data';
export var standardFieldDisplayOptions = {
    values: false,
    calcs: [ReducerID.mean],
    defaults: {
        min: 0,
        max: 100,
        thresholds: [
            { value: -Infinity, color: 'green' },
            { value: 80, color: 'red' },
        ],
        mappings: [],
    },
    override: {},
};
export var defaults = {
    sparkline: {
        show: true,
        full: false,
        lineColor: 'rgb(31, 120, 193)',
        fillColor: 'rgba(31, 118, 189, 0.18)',
    },
    fieldOptions: standardFieldDisplayOptions,
    orientation: VizOrientation.Auto,
    colorBackground: false,
    colorValue: false,
    colorPrefix: false,
    colorPostfix: false,
};
//# sourceMappingURL=types.js.map