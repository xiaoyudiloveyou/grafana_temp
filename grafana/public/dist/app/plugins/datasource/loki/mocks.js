export function makeMockLokiDatasource(labelsAndValues) {
    var labels = Object.keys(labelsAndValues);
    return {
        metadataRequest: function (url) {
            var responseData;
            if (url === '/api/prom/label') {
                responseData = labels;
            }
            else {
                var match = url.match(/^\/api\/prom\/label\/(\w*)\/values/);
                if (match) {
                    responseData = labelsAndValues[match[1]];
                }
            }
            if (responseData) {
                return {
                    data: {
                        data: responseData,
                    },
                };
            }
            else {
                throw new Error("Unexpected url error, " + url);
            }
        },
    };
}
//# sourceMappingURL=mocks.js.map