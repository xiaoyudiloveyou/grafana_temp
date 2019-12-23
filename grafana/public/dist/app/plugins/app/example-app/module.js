// Angular pages
import { ExampleConfigCtrl } from './legacy/config';
import { AngularExamplePageCtrl } from './legacy/angular_example_page';
import { AppPlugin } from '@grafana/ui';
import { ExamplePage1 } from './config/ExamplePage1';
import { ExamplePage2 } from './config/ExamplePage2';
import { ExampleRootPage } from './ExampleRootPage';
// Legacy exports just for testing
export { ExampleConfigCtrl as ConfigCtrl, AngularExamplePageCtrl, };
export var plugin = new AppPlugin()
    .setRootPage(ExampleRootPage)
    .addConfigPage({
    title: 'Page 1',
    icon: 'fa fa-info',
    body: ExamplePage1,
    id: 'page1',
})
    .addConfigPage({
    title: 'Page 2',
    icon: 'fa fa-user',
    body: ExamplePage2,
    id: 'page2',
});
//# sourceMappingURL=module.js.map