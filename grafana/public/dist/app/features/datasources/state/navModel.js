import * as tslib_1 from "tslib";
import { PluginType } from '@grafana/ui';
import config from 'app/core/config';
export function buildNavModel(dataSource, plugin) {
    var e_1, _a;
    var pluginMeta = plugin.meta;
    var navModel = {
        img: pluginMeta.info.logos.large,
        id: 'datasource-' + dataSource.id,
        subTitle: "Type: " + pluginMeta.name,
        url: '',
        text: dataSource.name,
        breadcrumbs: [{ title: 'Data Sources', url: 'datasources' }],
        children: [
            {
                active: false,
                icon: 'fa fa-fw fa-sliders',
                id: "datasource-settings-" + dataSource.id,
                text: 'Settings',
                url: "datasources/edit/" + dataSource.id + "/",
            },
        ],
    };
    if (plugin.configPages) {
        try {
            for (var _b = tslib_1.__values(plugin.configPages), _c = _b.next(); !_c.done; _c = _b.next()) {
                var page = _c.value;
                navModel.children.push({
                    active: false,
                    text: page.title,
                    icon: page.icon,
                    url: "datasources/edit/" + dataSource.id + "/?page=" + page.id,
                    id: "datasource-page-" + page.id,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (pluginMeta.includes && hasDashboards(pluginMeta.includes)) {
        navModel.children.push({
            active: false,
            icon: 'fa fa-fw fa-th-large',
            id: "datasource-dashboards-" + dataSource.id,
            text: 'Dashboards',
            url: "datasources/edit/" + dataSource.id + "/dashboards",
        });
    }
    if (config.buildInfo.isEnterprise) {
        navModel.children.push({
            active: false,
            icon: 'fa fa-fw fa-lock',
            id: "datasource-permissions-" + dataSource.id,
            text: 'Permissions',
            url: "datasources/edit/" + dataSource.id + "/permissions",
        });
    }
    return navModel;
}
export function getDataSourceLoadingNav(pageName) {
    var e_2, _a;
    var main = buildNavModel({
        access: '',
        basicAuth: false,
        basicAuthUser: '',
        basicAuthPassword: '',
        withCredentials: false,
        database: '',
        id: 1,
        isDefault: false,
        jsonData: { authType: 'credentials', defaultRegion: 'eu-west-2' },
        name: 'Loading',
        orgId: 1,
        password: '',
        readOnly: false,
        type: 'Loading',
        typeLogoUrl: 'public/img/icn-datasource.svg',
        url: '',
        user: '',
    }, {
        meta: {
            id: '1',
            type: PluginType.datasource,
            name: '',
            info: {
                author: {
                    name: '',
                    url: '',
                },
                description: '',
                links: [{ name: '', url: '' }],
                logos: {
                    large: '',
                    small: '',
                },
                screenshots: [],
                updated: '',
                version: '',
            },
            includes: [],
            module: '',
            baseUrl: '',
        },
    });
    var node;
    try {
        // find active page
        for (var _b = tslib_1.__values(main.children), _c = _b.next(); !_c.done; _c = _b.next()) {
            var child = _c.value;
            if (child.id.indexOf(pageName) > 0) {
                child.active = true;
                node = child;
                break;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return {
        main: main,
        node: node,
    };
}
function hasDashboards(includes) {
    return (includes.find(function (include) {
        return include.type === 'dashboard';
    }) !== undefined);
}
//# sourceMappingURL=navModel.js.map