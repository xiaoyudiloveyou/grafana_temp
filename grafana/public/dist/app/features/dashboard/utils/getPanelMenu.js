import { updateLocation } from 'app/core/actions';
import { store } from 'app/store/store';
import { removePanel, duplicatePanel, copyPanel, editPanelJson, sharePanel } from 'app/features/dashboard/utils/panel';
export var getPanelMenu = function (dashboard, panel) {
    var onViewPanel = function () {
        store.dispatch(updateLocation({
            query: {
                panelId: panel.id,
                edit: null,
                fullscreen: true,
            },
            partial: true,
        }));
    };
    var onEditPanel = function () {
        store.dispatch(updateLocation({
            query: {
                panelId: panel.id,
                edit: true,
                fullscreen: true,
            },
            partial: true,
        }));
    };
    var onSharePanel = function () {
        sharePanel(dashboard, panel);
    };
    var onDuplicatePanel = function () {
        duplicatePanel(dashboard, panel);
    };
    var onCopyPanel = function () {
        copyPanel(panel);
    };
    var onEditPanelJson = function () {
        editPanelJson(dashboard, panel);
    };
    var onRemovePanel = function () {
        removePanel(dashboard, panel, true);
    };
    var menu = [];
    menu.push({
        text: 'View',
        iconClassName: 'gicon gicon-viewer',
        onClick: onViewPanel,
        shortcut: 'v',
    });
    if (dashboard.meta.canEdit) {
        menu.push({
            text: 'Edit',
            iconClassName: 'gicon gicon-editor',
            onClick: onEditPanel,
            shortcut: 'e',
        });
    }
    menu.push({
        text: 'Share',
        iconClassName: 'fa fa-fw fa-share',
        onClick: onSharePanel,
        shortcut: 'p s',
    });
    var subMenu = [];
    if (!panel.fullscreen && dashboard.meta.canEdit) {
        subMenu.push({
            text: 'Duplicate',
            onClick: onDuplicatePanel,
            shortcut: 'p d',
        });
        subMenu.push({
            text: 'Copy',
            onClick: onCopyPanel,
        });
    }
    subMenu.push({
        text: 'Panel JSON',
        onClick: onEditPanelJson,
    });
    menu.push({
        type: 'submenu',
        text: 'More...',
        iconClassName: 'fa fa-fw fa-cube',
        subMenu: subMenu,
    });
    if (dashboard.meta.canEdit) {
        menu.push({ type: 'divider' });
        menu.push({
            text: 'Remove',
            iconClassName: 'fa fa-fw fa-trash',
            onClick: onRemovePanel,
            shortcut: 'p r',
        });
    }
    return menu;
};
//# sourceMappingURL=getPanelMenu.js.map