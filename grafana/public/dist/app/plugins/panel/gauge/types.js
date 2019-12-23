import { __assign } from "tslib";
import { VizOrientation } from '@grafana/ui';
import { standardFieldDisplayOptions } from '../singlestat2/types';
export var standardGaugeFieldOptions = __assign({}, standardFieldDisplayOptions);
export var defaults = {
    showThresholdMarkers: true,
    showThresholdLabels: false,
    fieldOptions: standardGaugeFieldOptions,
    orientation: VizOrientation.Auto,
};
//# sourceMappingURL=types.js.map