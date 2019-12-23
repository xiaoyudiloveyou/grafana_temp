import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { getAngularLoader } from '@grafana/runtime';
var PluginSettings = /** @class */ (function (_super) {
    tslib_1.__extends(PluginSettings, _super);
    function PluginSettings(props) {
        var _this = _super.call(this, props) || this;
        _this.onModelChanged = function (dataSource) {
            _this.props.onModelChange(dataSource);
        };
        _this.scopeProps = {
            ctrl: { datasourceMeta: props.dataSourceMeta, current: _.cloneDeep(props.dataSource) },
            onModelChanged: _this.onModelChanged,
        };
        _this.onModelChanged = _this.onModelChanged.bind(_this);
        return _this;
    }
    PluginSettings.prototype.componentDidMount = function () {
        var plugin = this.props.plugin;
        if (!this.element) {
            return;
        }
        if (!plugin.components.ConfigEditor) {
            // React editor is not specified, let's render angular editor
            // How to apprach this better? Introduce ReactDataSourcePlugin interface and typeguard it here?
            var loader = getAngularLoader();
            var template = '<plugin-component type="datasource-config-ctrl" />';
            this.component = loader.load(this.element, this.scopeProps, template);
        }
    };
    PluginSettings.prototype.componentDidUpdate = function (prevProps) {
        var plugin = this.props.plugin;
        if (!plugin.components.ConfigEditor && this.props.dataSource !== prevProps.dataSource) {
            this.scopeProps.ctrl.current = _.cloneDeep(this.props.dataSource);
            this.component.digest();
        }
    };
    PluginSettings.prototype.componentWillUnmount = function () {
        if (this.component) {
            this.component.destroy();
        }
    };
    PluginSettings.prototype.render = function () {
        var _this = this;
        var _a = this.props, plugin = _a.plugin, dataSource = _a.dataSource;
        if (!plugin) {
            return null;
        }
        return (React.createElement("div", { ref: function (element) { return (_this.element = element); } }, plugin.components.ConfigEditor &&
            React.createElement(plugin.components.ConfigEditor, {
                options: dataSource,
                onOptionsChange: this.onModelChanged,
            })));
    };
    return PluginSettings;
}(PureComponent));
export { PluginSettings };
export default PluginSettings;
//# sourceMappingURL=PluginSettings.js.map