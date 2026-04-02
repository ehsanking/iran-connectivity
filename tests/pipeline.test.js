const test = require('node:test');
const assert = require('node:assert/strict');

const { runPipeline, ORDER } = require('../src/core/pipeline');

test('pipeline defines L1..L7', () => {
    assert.deepEqual(ORDER, ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']);
});

test('pipeline report includes summary and 7 levels', async () => {
    const report = await runPipeline('127.0.0.1', { timeoutSeconds: 1 });
    assert.equal(report.schemaVersion, '1.0.0');
    assert.equal(report.target, '127.0.0.1');
    assert.equal(report.pipeline.levels.length, 7);
    assert.equal(report.pipeline.summary.totalLevels, 7);
});
