import { PanelPlugin } from '@grafana/ui';
import { GaugePanelEditor } from './GaugePanelEditor';
import { GaugePanel } from './GaugePanel';
import { defaults } from './types';
import { gaugePanelMigrationHandler, gaugePanelChangedHandler } from './GaugeMigrations';
export var plugin = new PanelPlugin(GaugePanel)
    .setDefaults(defaults)
    .setEditor(GaugePanelEditor)
    .setPanelChangeHandler(gaugePanelChangedHandler)
    .setMigrationHandler(gaugePanelMigrationHandler);
//# sourceMappingURL=module.js.map