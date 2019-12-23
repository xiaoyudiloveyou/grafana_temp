import * as tslib_1 from "tslib";
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import Page from 'app/core/components/Page/Page';
import { addDataSource, loadDataSourceTypes, setDataSourceTypeSearchQuery } from './state/actions';
import { getDataSourceTypes } from './state/selectors';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';
import { List, PluginType } from '@grafana/ui';
var NewDataSourcePage = /** @class */ (function (_super) {
    tslib_1.__extends(NewDataSourcePage, _super);
    function NewDataSourcePage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.categoryInfoList = [
            { id: 'tsdb', title: 'Time series databases' },
            { id: 'logging', title: 'Logging & document databases' },
            { id: 'sql', title: 'SQL' },
            { id: 'cloud', title: 'Cloud' },
            { id: 'other', title: 'Others' },
        ];
        _this.sortingRules = {
            prometheus: 100,
            graphite: 95,
            loki: 90,
            mysql: 80,
            postgres: 79,
            gcloud: -1,
        };
        _this.onDataSourceTypeClicked = function (plugin) {
            _this.props.addDataSource(plugin);
        };
        _this.onSearchQueryChange = function (value) {
            _this.props.setDataSourceTypeSearchQuery(value);
        };
        _this.onLearnMoreClick = function (evt) {
            evt.stopPropagation();
        };
        return _this;
    }
    NewDataSourcePage.prototype.componentDidMount = function () {
        this.props.loadDataSourceTypes();
        this.searchInput.focus();
    };
    NewDataSourcePage.prototype.renderTypes = function (types) {
        var _this = this;
        if (!types) {
            return null;
        }
        // apply custom sort ranking
        types.sort(function (a, b) {
            var aSort = _this.sortingRules[a.id] || 0;
            var bSort = _this.sortingRules[b.id] || 0;
            if (aSort > bSort) {
                return -1;
            }
            if (aSort < bSort) {
                return 1;
            }
            return a.name > b.name ? -1 : 1;
        });
        return (React.createElement(List, { items: types, getItemKey: function (item) { return item.id.toString(); }, renderItem: function (item) { return (React.createElement(DataSourceTypeCard, { plugin: item, onClick: function () { return _this.onDataSourceTypeClicked(item); }, onLearnMoreClick: _this.onLearnMoreClick })); } }));
    };
    NewDataSourcePage.prototype.renderGroupedList = function () {
        var _this = this;
        var dataSourceTypes = this.props.dataSourceTypes;
        if (dataSourceTypes.length === 0) {
            return null;
        }
        var categories = dataSourceTypes.reduce(function (accumulator, item) {
            var category = item.category || 'other';
            var list = accumulator[category] || [];
            list.push(item);
            accumulator[category] = list;
            return accumulator;
        }, {});
        categories['cloud'].push(getGrafanaCloudPhantomPlugin());
        return (React.createElement(React.Fragment, null,
            this.categoryInfoList.map(function (category) { return (React.createElement("div", { className: "add-data-source-category", key: category.id },
                React.createElement("div", { className: "add-data-source-category__header" }, category.title),
                _this.renderTypes(categories[category.id]))); }),
            React.createElement("div", { className: "add-data-source-more" },
                React.createElement("a", { className: "btn btn-inverse", href: "https://grafana.com/plugins?type=datasource&utm_source=new-data-source", target: "_blank", rel: "noopener" }, "Find more data source plugins on grafana.com"))));
    };
    NewDataSourcePage.prototype.render = function () {
        var _this = this;
        var _a = this.props, navModel = _a.navModel, isLoading = _a.isLoading, searchQuery = _a.searchQuery, dataSourceTypes = _a.dataSourceTypes;
        return (React.createElement(Page, { navModel: navModel },
            React.createElement(Page.Contents, { isLoading: isLoading },
                React.createElement("div", { className: "page-action-bar" },
                    React.createElement("div", { className: "gf-form gf-form--grow" },
                        React.createElement(FilterInput, { ref: function (elem) { return (_this.searchInput = elem); }, labelClassName: "gf-form--has-input-icon", inputClassName: "gf-form-input width-30", value: searchQuery, onChange: this.onSearchQueryChange, placeholder: "Filter by name or type" })),
                    React.createElement("div", { className: "page-action-bar__spacer" }),
                    React.createElement("a", { className: "btn btn-secondary", href: "datasources" }, "Cancel")),
                React.createElement("div", null,
                    searchQuery && this.renderTypes(dataSourceTypes),
                    !searchQuery && this.renderGroupedList()))));
    };
    return NewDataSourcePage;
}(PureComponent));
var DataSourceTypeCard = function (props) {
    var plugin = props.plugin, onLearnMoreClick = props.onLearnMoreClick;
    var canSelect = plugin.id !== 'gcloud';
    var onClick = canSelect ? props.onClick : function () { };
    // find first plugin info link
    var learnMoreLink = plugin.info.links && plugin.info.links.length > 0 ? plugin.info.links[0].url : null;
    return (React.createElement("div", { className: "add-data-source-item", onClick: onClick, "aria-label": plugin.name + " datasource plugin" },
        React.createElement("img", { className: "add-data-source-item-logo", src: plugin.info.logos.small }),
        React.createElement("div", { className: "add-data-source-item-text-wrapper" },
            React.createElement("span", { className: "add-data-source-item-text" }, plugin.name),
            plugin.info.description && React.createElement("span", { className: "add-data-source-item-desc" }, plugin.info.description)),
        React.createElement("div", { className: "add-data-source-item-actions" },
            learnMoreLink && (React.createElement("a", { className: "btn btn-inverse", href: learnMoreLink + "?utm_source=grafana_add_ds", target: "_blank", rel: "noopener", onClick: onLearnMoreClick },
                "Learn more ",
                React.createElement("i", { className: "fa fa-external-link add-datasource-item-actions__btn-icon" }))),
            canSelect && React.createElement("button", { className: "btn btn-primary" }, "Select"))));
};
function getGrafanaCloudPhantomPlugin() {
    return {
        id: 'gcloud',
        name: 'Grafana Cloud',
        type: PluginType.datasource,
        module: '',
        baseUrl: '',
        info: {
            description: 'Hosted Graphite, Prometheus and Loki',
            logos: { small: 'public/img/grafana_icon.svg', large: 'asd' },
            author: { name: 'Grafana Labs' },
            links: [
                {
                    url: 'https://grafana.com/cloud',
                    name: 'Learn more',
                },
            ],
            screenshots: [],
            updated: '2019-05-10',
            version: '1.0.0',
        },
    };
}
export function getNavModel() {
    var main = {
        icon: 'gicon gicon-add-datasources',
        id: 'datasource-new',
        text: 'Add data source',
        href: 'datasources/new',
        subTitle: 'Choose a data source type',
    };
    return {
        main: main,
        node: main,
    };
}
function mapStateToProps(state) {
    return {
        navModel: getNavModel(),
        dataSourceTypes: getDataSourceTypes(state.dataSources),
        searchQuery: state.dataSources.dataSourceTypeSearchQuery,
        isLoading: state.dataSources.isLoadingDataSources,
    };
}
var mapDispatchToProps = {
    addDataSource: addDataSource,
    loadDataSourceTypes: loadDataSourceTypes,
    setDataSourceTypeSearchQuery: setDataSourceTypeSearchQuery,
};
export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(NewDataSourcePage));
//# sourceMappingURL=NewDataSourcePage.js.map