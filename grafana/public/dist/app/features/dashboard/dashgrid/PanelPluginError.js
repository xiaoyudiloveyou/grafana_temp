import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
// Components
import { AlertBox } from 'app/core/components/AlertBox/AlertBox';
// Types
import { AppNotificationSeverity } from 'app/types';
import { PanelPlugin, PluginType } from '@grafana/ui';
var PanelPluginError = /** @class */ (function (_super) {
    tslib_1.__extends(PanelPluginError, _super);
    function PanelPluginError(props) {
        return _super.call(this, props) || this;
    }
    PanelPluginError.prototype.render = function () {
        var style = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        };
        return (React.createElement("div", { style: style },
            React.createElement(AlertBox, tslib_1.__assign({ severity: AppNotificationSeverity.Error }, this.props))));
    };
    return PanelPluginError;
}(PureComponent));
export function getPanelPluginLoadError(meta, err) {
    var LoadError = /** @class */ (function (_super) {
        tslib_1.__extends(LoadError, _super);
        function LoadError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoadError.prototype.render = function () {
            var text = (React.createElement(React.Fragment, null,
                "Check the server startup logs for more information. ",
                React.createElement("br", null),
                "If this plugin was loaded from git, make sure it was compiled."));
            return React.createElement(PanelPluginError, { title: "Error loading: " + meta.id, text: text });
        };
        return LoadError;
    }(PureComponent));
    var plugin = new PanelPlugin(LoadError);
    plugin.meta = meta;
    plugin.loadError = true;
    return plugin;
}
export function getPanelPluginNotFound(id) {
    var NotFound = /** @class */ (function (_super) {
        tslib_1.__extends(NotFound, _super);
        function NotFound() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NotFound.prototype.render = function () {
            return React.createElement(PanelPluginError, { title: "Panel plugin not found: " + id });
        };
        return NotFound;
    }(PureComponent));
    var plugin = new PanelPlugin(NotFound);
    plugin.meta = {
        id: id,
        name: id,
        sort: 100,
        type: PluginType.panel,
        module: '',
        baseUrl: '',
        info: {
            author: {
                name: '',
            },
            description: '',
            links: [],
            logos: {
                large: '',
                small: '',
            },
            screenshots: [],
            updated: '',
            version: '',
        },
    };
    return plugin;
}
//# sourceMappingURL=PanelPluginError.js.map