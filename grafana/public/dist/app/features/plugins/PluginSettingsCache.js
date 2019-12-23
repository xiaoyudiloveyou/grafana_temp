import { getBackendSrv } from 'app/core/services/backend_srv';
var pluginInfoCache = {};
export function getPluginSettings(pluginId) {
    var v = pluginInfoCache[pluginId];
    if (v) {
        return Promise.resolve(v);
    }
    return getBackendSrv()
        .get("/api/plugins/" + pluginId + "/settings")
        .then(function (settings) {
        pluginInfoCache[pluginId] = settings;
        return settings;
    })
        .catch(function (err) {
        // err.isHandled = true;
        return Promise.reject('Unknown Plugin');
    });
}
//# sourceMappingURL=PluginSettingsCache.js.map