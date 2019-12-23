import { PanelPlugin } from '@grafana/ui';
import { defaults } from './types';
import { LogsPanel } from './LogsPanel';
import { LogsPanelEditor } from './LogsPanelEditor';
export var plugin = new PanelPlugin(LogsPanel).setDefaults(defaults).setEditor(LogsPanelEditor);
//# sourceMappingURL=module.js.map