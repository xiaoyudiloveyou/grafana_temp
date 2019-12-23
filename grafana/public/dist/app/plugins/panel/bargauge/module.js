import { PanelPlugin, sharedSingleStatPanelChangedHandler } from '@grafana/ui';
import { BarGaugePanel } from './BarGaugePanel';
import { BarGaugePanelEditor } from './BarGaugePanelEditor';
import { defaults } from './types';
import { barGaugePanelMigrationHandler } from './BarGaugeMigrations';
export var plugin = new PanelPlugin(BarGaugePanel)
    .setDefaults(defaults)
    .setEditor(BarGaugePanelEditor)
    .setPanelChangeHandler(sharedSingleStatPanelChangedHandler)
    .setMigrationHandler(barGaugePanelMigrationHandler);
//# sourceMappingURL=module.js.map