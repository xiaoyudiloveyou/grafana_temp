import { PanelPlugin } from '@grafana/ui';
import { GraphPanelEditor } from './GraphPanelEditor';
import { GraphPanel } from './GraphPanel';
import { defaults } from './types';
export var plugin = new PanelPlugin(GraphPanel).setDefaults(defaults).setEditor(GraphPanelEditor);
//# sourceMappingURL=module.js.map