import * as tslib_1 from "tslib";
import tags from 'app/core/utils/tags';
var AdminListUsersCtrl = /** @class */ (function () {
    /** @ngInject */
    function AdminListUsersCtrl(backendSrv, navModelSrv) {
        this.backendSrv = backendSrv;
        this.pages = [];
        this.perPage = 50;
        this.page = 1;
        this.showPaging = false;
        this.navModel = navModelSrv.getNav('admin', 'global-users', 0);
        this.query = '';
        this.getUsers();
    }
    AdminListUsersCtrl.prototype.getUsers = function () {
        var _this = this;
        this.backendSrv
            .get("/api/users/search?perpage=" + this.perPage + "&page=" + this.page + "&query=" + this.query)
            .then(function (result) {
            _this.users = result.users;
            _this.page = result.page;
            _this.perPage = result.perPage;
            _this.totalPages = Math.ceil(result.totalCount / result.perPage);
            _this.showPaging = _this.totalPages > 1;
            _this.pages = [];
            for (var i = 1; i < _this.totalPages + 1; i++) {
                _this.pages.push({ page: i, current: i === _this.page });
            }
            _this.addUsersAuthLabels();
        });
    };
    AdminListUsersCtrl.prototype.navigateToPage = function (page) {
        this.page = page.page;
        this.getUsers();
    };
    AdminListUsersCtrl.prototype.addUsersAuthLabels = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.users), _c = _b.next(); !_c.done; _c = _b.next()) {
                var user = _c.value;
                user.authLabel = getAuthLabel(user);
                user.authLabelStyle = getAuthLabelStyle(user.authLabel);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return AdminListUsersCtrl;
}());
export default AdminListUsersCtrl;
function getAuthLabel(user) {
    if (user.authLabels && user.authLabels.length) {
        return user.authLabels[0];
    }
    return '';
}
function getAuthLabelStyle(label) {
    if (label === 'LDAP' || !label) {
        return {};
    }
    var _a = tags.getTagColorsFromName(label), color = _a.color, borderColor = _a.borderColor;
    return {
        'background-color': color,
        'border-color': borderColor,
    };
}
//# sourceMappingURL=AdminListUsersCtrl.js.map