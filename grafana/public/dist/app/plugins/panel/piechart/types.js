import { __assign } from "tslib";
import { PieChartType, VizOrientation } from '@grafana/ui';
import { standardFieldDisplayOptions } from '../singlestat2/types';
import { ReducerID } from '@grafana/data';
export var defaults = {
    pieType: PieChartType.PIE,
    strokeWidth: 1,
    orientation: VizOrientation.Auto,
    fieldOptions: __assign(__assign({}, standardFieldDisplayOptions), { calcs: [ReducerID.last], defaults: {
            unit: 'short',
        } }),
};
//# sourceMappingURL=types.js.map