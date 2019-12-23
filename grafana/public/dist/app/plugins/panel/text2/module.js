import { PanelPlugin } from '@grafana/ui';
import { TextPanelEditor } from './TextPanelEditor';
import { TextPanel } from './TextPanel';
import { defaults } from './types';
export var plugin = new PanelPlugin(TextPanel)
    .setDefaults(defaults)
    .setEditor(TextPanelEditor)
    .setPanelChangeHandler(function (options, prevPluginId, prevOptions) {
    if (prevPluginId === 'text') {
        return prevOptions;
    }
    return options;
});
//# sourceMappingURL=module.js.map