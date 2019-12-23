import { DataSourcePlugin } from '@grafana/ui';
import { InputDatasource } from './InputDatasource';
import { InputQueryEditor } from './InputQueryEditor';
import { InputConfigEditor } from './InputConfigEditor';
export var plugin = new DataSourcePlugin(InputDatasource)
    .setConfigEditor(InputConfigEditor)
    .setQueryEditor(InputQueryEditor);
//# sourceMappingURL=module.js.map