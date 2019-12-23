import { PanelPlugin } from '@grafana/ui';
import { TablePanelEditor } from './TablePanelEditor';
import { TablePanel } from './TablePanel';
import { defaults } from './types';
export var plugin = new PanelPlugin(TablePanel).setDefaults(defaults).setEditor(TablePanelEditor);
//# sourceMappingURL=module.js.map