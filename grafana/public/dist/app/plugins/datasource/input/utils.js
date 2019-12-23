import { toDataFrame, toCSV } from '@grafana/data';
export function dataFrameToCSV(dto) {
    if (!dto || !dto.length) {
        return '';
    }
    return toCSV(dto.map(function (v) { return toDataFrame(dto); }));
}
//# sourceMappingURL=utils.js.map