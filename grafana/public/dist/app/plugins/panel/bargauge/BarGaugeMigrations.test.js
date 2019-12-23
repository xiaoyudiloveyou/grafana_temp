import { barGaugePanelMigrationHandler } from './BarGaugeMigrations';
describe('BarGauge Panel Migrations', function () {
    it('from 6.2', function () {
        var panel = {
            id: 7,
            links: [],
            options: {
                displayMode: 'lcd',
                fieldOptions: {
                    calcs: ['mean'],
                    defaults: {
                        decimals: null,
                        max: -22,
                        min: 33,
                        unit: 'watt',
                    },
                    mappings: [],
                    override: {},
                    thresholds: [
                        {
                            color: 'green',
                            index: 0,
                            value: null,
                        },
                        {
                            color: 'orange',
                            index: 1,
                            value: 40,
                        },
                        {
                            color: 'red',
                            index: 2,
                            value: 80,
                        },
                    ],
                    values: false,
                },
                orientation: 'vertical',
            },
            pluginVersion: '6.2.0',
            targets: [],
            title: 'Usage',
            type: 'bargauge',
        };
        expect(barGaugePanelMigrationHandler(panel)).toMatchSnapshot();
    });
});
//# sourceMappingURL=BarGaugeMigrations.test.js.map