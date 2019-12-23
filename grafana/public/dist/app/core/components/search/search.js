import { __assign } from "tslib";
import _, { debounce } from 'lodash';
import coreModule from '../../core_module';
import { contextSrv } from 'app/core/services/context_srv';
import appEvents from 'app/core/app_events';
import { parse } from 'search-query-parser';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
var SearchQueryParser = /** @class */ (function () {
    function SearchQueryParser(config) {
        this.config = config;
    }
    SearchQueryParser.prototype.parse = function (query) {
        var parsedQuery = parse(query, this.config);
        if (typeof parsedQuery === 'string') {
            return {
                text: parsedQuery,
            };
        }
        return parsedQuery;
    };
    return SearchQueryParser;
}());
var SearchCtrl = /** @class */ (function () {
    /** @ngInject */
    function SearchCtrl($scope, $location, $timeout, searchSrv) {
        var _this = this;
        this.$location = $location;
        this.$timeout = $timeout;
        this.searchSrv = searchSrv;
        this.getTags = function () {
            return _this.searchSrv.getDashboardTags();
        };
        this.onTagFiltersChanged = function (tags) {
            _this.query.tags = tags;
            _this.search();
        };
        appEvents.on('show-dash-search', this.openSearch.bind(this), $scope);
        appEvents.on('hide-dash-search', this.closeSearch.bind(this), $scope);
        appEvents.on('search-query', debounce(this.search.bind(this), 500), $scope);
        this.initialFolderFilterTitle = 'All';
        this.isEditor = contextSrv.isEditor;
        this.hasEditPermissionInFolders = contextSrv.hasEditPermissionInFolders;
        this.onQueryChange = this.onQueryChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.query = {
            query: '',
            parsedQuery: { text: '' },
            tags: [],
            starred: false,
        };
        this.queryParser = new SearchQueryParser({
            keywords: ['folder'],
        });
    }
    SearchCtrl.prototype.closeSearch = function () {
        this.isOpen = this.ignoreClose;
    };
    SearchCtrl.prototype.onQueryChange = function (query) {
        if (typeof query === 'string') {
            this.query = __assign(__assign({}, this.query), { parsedQuery: this.queryParser.parse(query), query: query });
        }
        else {
            this.query = query;
        }
        appEvents.emit('search-query');
    };
    SearchCtrl.prototype.openSearch = function (payload) {
        var _this = this;
        if (payload === void 0) { payload = {}; }
        if (this.isOpen) {
            this.closeSearch();
            return;
        }
        this.isOpen = true;
        this.giveSearchFocus = true;
        this.selectedIndex = -1;
        this.results = [];
        this.query = {
            query: payload.query ? payload.query + " " : '',
            parsedQuery: this.queryParser.parse(payload.query),
            tags: [],
            starred: false,
        };
        this.currentSearchId = 0;
        this.ignoreClose = true;
        this.isLoading = true;
        this.$timeout(function () {
            _this.ignoreClose = false;
            _this.giveSearchFocus = true;
            _this.search();
        }, 100);
    };
    SearchCtrl.prototype.onKeyDown = function (evt) {
        if (evt.keyCode === 27) {
            this.closeSearch();
        }
        if (evt.keyCode === 40) {
            this.moveSelection(1);
        }
        if (evt.keyCode === 38) {
            this.moveSelection(-1);
        }
        if (evt.keyCode === 13) {
            var flattenedResult = this.getFlattenedResultForNavigation();
            var currentItem = flattenedResult[this.selectedIndex];
            if (currentItem) {
                if (currentItem.dashboardIndex !== undefined) {
                    var selectedDash = this.results[currentItem.folderIndex].items[currentItem.dashboardIndex];
                    if (selectedDash) {
                        this.$location.search({});
                        this.$location.path(selectedDash.url);
                        this.closeSearch();
                    }
                }
                else {
                    var selectedFolder = this.results[currentItem.folderIndex];
                    if (selectedFolder) {
                        selectedFolder.toggle(selectedFolder);
                    }
                }
            }
        }
    };
    SearchCtrl.prototype.onFilterboxClick = function () {
        this.giveSearchFocus = false;
        this.preventClose();
    };
    SearchCtrl.prototype.preventClose = function () {
        var _this = this;
        this.ignoreClose = true;
        this.$timeout(function () {
            _this.ignoreClose = false;
        }, 100);
    };
    SearchCtrl.prototype.moveSelection = function (direction) {
        if (this.results.length === 0) {
            return;
        }
        var flattenedResult = this.getFlattenedResultForNavigation();
        var currentItem = flattenedResult[this.selectedIndex];
        if (currentItem) {
            if (currentItem.dashboardIndex !== undefined) {
                this.results[currentItem.folderIndex].items[currentItem.dashboardIndex].selected = false;
            }
            else {
                this.results[currentItem.folderIndex].selected = false;
            }
        }
        if (direction === 0) {
            this.selectedIndex = -1;
            return;
        }
        var max = flattenedResult.length;
        var newIndex = (this.selectedIndex + direction) % max;
        this.selectedIndex = newIndex < 0 ? newIndex + max : newIndex;
        var selectedItem = flattenedResult[this.selectedIndex];
        if (selectedItem.dashboardIndex === undefined && this.results[selectedItem.folderIndex].id === 0) {
            this.moveSelection(direction);
            return;
        }
        if (selectedItem.dashboardIndex !== undefined) {
            if (!this.results[selectedItem.folderIndex].expanded) {
                this.moveSelection(direction);
                return;
            }
            this.results[selectedItem.folderIndex].items[selectedItem.dashboardIndex].selected = true;
            return;
        }
        if (this.results[selectedItem.folderIndex].hideHeader) {
            this.moveSelection(direction);
            return;
        }
        this.results[selectedItem.folderIndex].selected = true;
    };
    SearchCtrl.prototype.searchDashboards = function (folderContext) {
        var _this = this;
        this.currentSearchId = this.currentSearchId + 1;
        var localSearchId = this.currentSearchId;
        var folderIds = [];
        var parsedQuery = this.query.parsedQuery;
        if (folderContext === 'current') {
            folderIds.push(getDashboardSrv().getCurrent().meta.folderId);
        }
        var query = __assign(__assign({}, this.query), { query: parsedQuery.text, tag: this.query.tags, folderIds: folderIds });
        return this.searchSrv
            .search(__assign({}, query))
            .then(function (results) {
            if (localSearchId < _this.currentSearchId) {
                return;
            }
            _this.results = results || [];
            _this.isLoading = false;
            _this.moveSelection(1);
        });
    };
    SearchCtrl.prototype.queryHasNoFilters = function () {
        var query = this.query;
        return query.query === '' && query.starred === false && query.tags.length === 0;
    };
    SearchCtrl.prototype.filterByTag = function (tag) {
        if (_.indexOf(this.query.tags, tag) === -1) {
            this.query.tags.push(tag);
            this.search();
        }
    };
    SearchCtrl.prototype.removeTag = function (tag, evt) {
        this.query.tags = _.without(this.query.tags, tag);
        this.search();
        this.giveSearchFocus = true;
        evt.stopPropagation();
        evt.preventDefault();
    };
    SearchCtrl.prototype.clearSearchFilter = function () {
        this.query.query = '';
        this.query.tags = [];
        this.search();
    };
    SearchCtrl.prototype.showStarred = function () {
        this.query.starred = !this.query.starred;
        this.giveSearchFocus = true;
        this.search();
    };
    SearchCtrl.prototype.search = function () {
        this.showImport = false;
        this.selectedIndex = -1;
        this.searchDashboards(this.query.parsedQuery['folder']);
    };
    SearchCtrl.prototype.folderExpanding = function () {
        this.moveSelection(0);
    };
    SearchCtrl.prototype.getFlattenedResultForNavigation = function () {
        var folderIndex = 0;
        return _.flatMap(this.results, function (s) {
            var result = [];
            result.push({
                folderIndex: folderIndex,
            });
            var dashboardIndex = 0;
            result = result.concat(_.map(s.items || [], function (i) {
                return {
                    folderIndex: folderIndex,
                    dashboardIndex: dashboardIndex++,
                };
            }));
            folderIndex++;
            return result;
        });
    };
    return SearchCtrl;
}());
export { SearchCtrl };
export function searchDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/search/search.html',
        controller: SearchCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {},
    };
}
coreModule.directive('dashboardSearch', searchDirective);
//# sourceMappingURL=search.js.map