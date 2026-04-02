const checks = require('../checks');
const { buildReport } = require('../report/build_report');

const ORDER = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];

async function runPipeline(target, options = {}) {
    const context = {
        timeoutSeconds: Number(options.timeoutSeconds || 5)
    };

    const levels = [];
    for (const level of ORDER) {
        const result = await checks[level].run(target, context);
        levels.push(result);
    }

    return buildReport(target, levels, options.extra || {});
}

module.exports = {
    ORDER,
    runPipeline
};
