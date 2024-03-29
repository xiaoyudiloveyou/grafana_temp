export var MetricKind;
(function (MetricKind) {
    MetricKind["METRIC_KIND_UNSPECIFIED"] = "METRIC_KIND_UNSPECIFIED";
    MetricKind["GAUGE"] = "GAUGE";
    MetricKind["DELTA"] = "DELTA";
    MetricKind["CUMULATIVE"] = "CUMULATIVE";
})(MetricKind || (MetricKind = {}));
export var ValueTypes;
(function (ValueTypes) {
    ValueTypes["VALUE_TYPE_UNSPECIFIED"] = "VALUE_TYPE_UNSPECIFIED";
    ValueTypes["BOOL"] = "BOOL";
    ValueTypes["INT64"] = "INT64";
    ValueTypes["DOUBLE"] = "DOUBLE";
    ValueTypes["STRING"] = "STRING";
    ValueTypes["DISTRIBUTION"] = "DISTRIBUTION";
    ValueTypes["MONEY"] = "MONEY";
})(ValueTypes || (ValueTypes = {}));
export var alignOptions = [
    {
        text: 'delta',
        value: 'ALIGN_DELTA',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.CUMULATIVE, MetricKind.DELTA],
    },
    {
        text: 'rate',
        value: 'ALIGN_RATE',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.CUMULATIVE, MetricKind.DELTA],
    },
    {
        text: 'interpolate',
        value: 'ALIGN_INTERPOLATE',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE],
    },
    {
        text: 'next older',
        value: 'ALIGN_NEXT_OLDER',
        valueTypes: [
            ValueTypes.INT64,
            ValueTypes.DOUBLE,
            ValueTypes.MONEY,
            ValueTypes.DISTRIBUTION,
            ValueTypes.STRING,
            ValueTypes.VALUE_TYPE_UNSPECIFIED,
            ValueTypes.BOOL,
        ],
        metricKinds: [MetricKind.GAUGE],
    },
    {
        text: 'min',
        value: 'ALIGN_MIN',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'max',
        value: 'ALIGN_MAX',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'mean',
        value: 'ALIGN_MEAN',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'count',
        value: 'ALIGN_COUNT',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'sum',
        value: 'ALIGN_SUM',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'stddev',
        value: 'ALIGN_STDDEV',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'count true',
        value: 'ALIGN_COUNT_TRUE',
        valueTypes: [ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE],
    },
    {
        text: 'count false',
        value: 'ALIGN_COUNT_FALSE',
        valueTypes: [ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE],
    },
    {
        text: 'fraction true',
        value: 'ALIGN_FRACTION_TRUE',
        valueTypes: [ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE],
    },
    {
        text: 'percentile 99',
        value: 'ALIGN_PERCENTILE_99',
        valueTypes: [ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'percentile 95',
        value: 'ALIGN_PERCENTILE_95',
        valueTypes: [ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'percentile 50',
        value: 'ALIGN_PERCENTILE_50',
        valueTypes: [ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'percentile 05',
        value: 'ALIGN_PERCENTILE_05',
        valueTypes: [ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'percent change',
        value: 'ALIGN_PERCENT_CHANGE',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
];
export var aggOptions = [
    {
        text: 'none',
        value: 'REDUCE_NONE',
        valueTypes: [
            ValueTypes.INT64,
            ValueTypes.DOUBLE,
            ValueTypes.MONEY,
            ValueTypes.DISTRIBUTION,
            ValueTypes.BOOL,
            ValueTypes.STRING,
        ],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE, MetricKind.METRIC_KIND_UNSPECIFIED],
    },
    {
        text: 'mean',
        value: 'REDUCE_MEAN',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'min',
        value: 'REDUCE_MIN',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE, MetricKind.METRIC_KIND_UNSPECIFIED],
    },
    {
        text: 'max',
        value: 'REDUCE_MAX',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE, MetricKind.METRIC_KIND_UNSPECIFIED],
    },
    {
        text: 'sum',
        value: 'REDUCE_SUM',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE, MetricKind.METRIC_KIND_UNSPECIFIED],
    },
    {
        text: 'std. dev.',
        value: 'REDUCE_STDDEV',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE, MetricKind.METRIC_KIND_UNSPECIFIED],
    },
    {
        text: 'count',
        value: 'REDUCE_COUNT',
        valueTypes: [
            ValueTypes.INT64,
            ValueTypes.DOUBLE,
            ValueTypes.MONEY,
            ValueTypes.DISTRIBUTION,
            ValueTypes.BOOL,
            ValueTypes.STRING,
        ],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE],
    },
    {
        text: 'count true',
        value: 'REDUCE_COUNT_TRUE',
        valueTypes: [ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: 'count false',
        value: 'REDUCE_COUNT_FALSE',
        valueTypes: [ValueTypes.BOOL],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA],
    },
    {
        text: '99th percentile',
        value: 'REDUCE_PERCENTILE_99',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE],
    },
    {
        text: '95th percentile',
        value: 'REDUCE_PERCENTILE_95',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE],
    },
    {
        text: '50th percentile',
        value: 'REDUCE_PERCENTILE_50',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE],
    },
    {
        text: '5th percentile',
        value: 'REDUCE_PERCENTILE_05',
        valueTypes: [ValueTypes.INT64, ValueTypes.DOUBLE, ValueTypes.MONEY, ValueTypes.DISTRIBUTION],
        metricKinds: [MetricKind.GAUGE, MetricKind.DELTA, MetricKind.CUMULATIVE],
    },
];
export var alignmentPeriods = [
    { text: 'grafana auto', value: 'grafana-auto' },
    { text: 'stackdriver auto', value: 'stackdriver-auto' },
    { text: '1m', value: '+60s' },
    { text: '2m', value: '+120s' },
    { text: '5m', value: '+300s' },
    { text: '10m', value: '+600s' },
    { text: '30m', value: '+1800s' },
    { text: '1h', value: '+3600s' },
    { text: '3h', value: '+7200s' },
    { text: '6h', value: '+21600s' },
    { text: '1d', value: '+86400s' },
    { text: '3d', value: '+259200s' },
    { text: '1w', value: '+604800s' },
];
export var stackdriverUnitMappings = {
    bit: 'bits',
    By: 'bytes',
    s: 's',
    min: 'm',
    h: 'h',
    d: 'd',
    us: 'µs',
    ms: 'ms',
    ns: 'ns',
    percent: 'percent',
    MiBy: 'mbytes',
    'By/s': 'Bps',
    GBy: 'decgbytes',
};
//# sourceMappingURL=constants.js.map