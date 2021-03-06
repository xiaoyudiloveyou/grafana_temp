import React from 'react';
import PageHeader from './PageHeader';
import { shallow } from 'enzyme';
describe('PageHeader', function () {
    var wrapper;
    describe('when the nav tree has a node with a title', function () {
        beforeAll(function () {
            var nav = {
                main: {
                    icon: 'fa fa-folder-open',
                    id: 'node',
                    subTitle: 'node subtitle',
                    url: '',
                    text: 'node',
                },
                node: {},
            };
            wrapper = shallow(React.createElement(PageHeader, { model: nav }));
        });
        it('should render the title', function () {
            var title = wrapper.find('.page-header__title');
            expect(title.text()).toBe('node');
        });
    });
    describe('when the nav tree has a node with breadcrumbs and a title', function () {
        beforeAll(function () {
            var nav = {
                main: {
                    icon: 'fa fa-folder-open',
                    id: 'child',
                    subTitle: 'child subtitle',
                    url: '',
                    text: 'child',
                    breadcrumbs: [{ title: 'Parent', url: 'parentUrl' }],
                },
                node: {},
            };
            wrapper = shallow(React.createElement(PageHeader, { model: nav }));
        });
        it('should render the title with breadcrumbs first and then title last', function () {
            var title = wrapper.find('.page-header__title');
            expect(title.text()).toBe('Parent / child');
            var parentLink = wrapper.find('.page-header__title > a.text-link');
            expect(parentLink.prop('href')).toBe('parentUrl');
        });
    });
});
//# sourceMappingURL=PageHeader.test.js.map