import { AnnoListPanel } from './AnnoListPanel';
import { defaults } from './types';
import { AnnoListEditor } from './AnnoListEditor';
import { PanelPlugin } from '@grafana/ui';
export var plugin = new PanelPlugin(AnnoListPanel)
    .setDefaults(defaults)
    .setEditor(AnnoListEditor)
    // TODO, we should support this directly in the plugin infrastructure
    .setPanelChangeHandler(function (options, prevPluginId, prevOptions) {
    if (prevPluginId === 'ryantxu-annolist-panel') {
        return prevOptions;
    }
    return options;
});
//# sourceMappingURL=module.js.map