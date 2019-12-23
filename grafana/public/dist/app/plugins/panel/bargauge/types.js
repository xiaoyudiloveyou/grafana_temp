import { VizOrientation } from '@grafana/ui';
import { standardGaugeFieldOptions } from '../gauge/types';
export var displayModes = [
    { value: 'gradient', label: 'Gradient' },
    { value: 'lcd', label: 'Retro LCD' },
    { value: 'basic', label: 'Basic' },
];
export var orientationOptions = [
    { value: VizOrientation.Horizontal, label: 'Horizontal' },
    { value: VizOrientation.Vertical, label: 'Vertical' },
];
export var defaults = {
    displayMode: 'lcd',
    orientation: VizOrientation.Horizontal,
    fieldOptions: standardGaugeFieldOptions,
};
//# sourceMappingURL=types.js.map