import { PanelPlugin, sharedSingleStatMigrationHandler, sharedSingleStatPanelChangedHandler } from '@grafana/ui';
import { defaults } from './types';
import { SingleStatPanel } from './SingleStatPanel';
import { SingleStatEditor } from './SingleStatEditor';
export var plugin = new PanelPlugin(SingleStatPanel)
    .setDefaults(defaults)
    .setEditor(SingleStatEditor)
    .setPanelChangeHandler(sharedSingleStatPanelChangedHandler)
    .setMigrationHandler(sharedSingleStatMigrationHandler);
//# sourceMappingURL=module.js.map