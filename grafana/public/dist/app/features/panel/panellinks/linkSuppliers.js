import { getTimeField } from '@grafana/data';
import { getLinkSrv } from './link_srv';
/**
 * Link suppliers creates link models based on a link origin
 */
export var getFieldLinksSupplier = function (value) {
    var links = value.field.links;
    if (!links || links.length === 0) {
        return undefined;
    }
    return {
        getLinks: function (_scopedVars) {
            var scopedVars = {};
            if (value.view) {
                var dataFrame = value.view.dataFrame;
                scopedVars['__series'] = {
                    value: {
                        name: dataFrame.name,
                        labels: dataFrame.labels,
                        refId: dataFrame.refId,
                    },
                    text: 'Series',
                };
                var field = value.colIndex !== undefined ? dataFrame.fields[value.colIndex] : undefined;
                if (field) {
                    console.log('Full Field Info:', field);
                    scopedVars['__field'] = {
                        value: {
                            name: field.name,
                        },
                        text: 'Field',
                    };
                }
                if (value.rowIndex) {
                    var timeField = getTimeField(dataFrame).timeField;
                    scopedVars['__value'] = {
                        value: {
                            raw: field.values.get(value.rowIndex),
                            numeric: value.display.numeric,
                            text: value.display.text,
                            time: timeField ? timeField.values.get(value.rowIndex) : undefined,
                        },
                        text: 'Value',
                    };
                }
                else {
                    // calculation
                    scopedVars['__value'] = {
                        value: {
                            raw: value.display.numeric,
                            numeric: value.display.numeric,
                            text: value.display.text,
                            calc: value.name,
                        },
                        text: 'Value',
                    };
                }
            }
            else {
                console.log('VALUE', value);
            }
            return links.map(function (link) {
                return getLinkSrv().getDataLinkUIModel(link, scopedVars, value);
            });
        },
    };
};
export var getPanelLinksSupplier = function (value) {
    var links = value.links;
    if (!links || links.length === 0) {
        return undefined;
    }
    return {
        getLinks: function () {
            return links.map(function (link) {
                return getLinkSrv().getDataLinkUIModel(link, value.scopedVars, value);
            });
        },
    };
};
//# sourceMappingURL=linkSuppliers.js.map