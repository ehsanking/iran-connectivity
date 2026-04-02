const test = require('node:test');
const assert = require('node:assert/strict');

const { run, normalizeTimeoutSeconds } = require('../src/checks/l3_ping');

test('normalizeTimeoutSeconds sanitizes invalid values', () => {
    assert.equal(normalizeTimeoutSeconds('1; rm -rf /'), 1);
    assert.equal(normalizeTimeoutSeconds('-5'), 5);
    assert.equal(normalizeTimeoutSeconds('not-a-number'), 5);
    assert.equal(normalizeTimeoutSeconds('999'), 60);
});

test('l3 ping skips execution for non-IPv4 target', async () => {
    const result = await run('8.8.8.8; echo pwned', { timeoutSeconds: '1; touch /tmp/pwned' });
    assert.equal(result.ok, false);
    assert.equal(result.details, 'Target is not a valid IPv4 address');
    assert.equal(result.meta.commandSkipped, true);
});
