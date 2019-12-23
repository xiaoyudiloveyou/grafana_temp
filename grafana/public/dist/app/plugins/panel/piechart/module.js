import { PanelPlugin } from '@grafana/ui';
import { PieChartPanelEditor } from './PieChartPanelEditor';
import { PieChartPanel } from './PieChartPanel';
import { defaults } from './types';
export var plugin = new PanelPlugin(PieChartPanel)
    .setDefaults(defaults)
    .setEditor(PieChartPanelEditor);
//# sourceMappingURL=module.js.map