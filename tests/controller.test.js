const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { runDistributed } = require('../src/core/controller');

test('controller run loads inventory and returns reports', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'iran-check-'));
    const inventoryPath = path.join(dir, 'inventory.json');
    fs.writeFileSync(inventoryPath, JSON.stringify({ targets: ['127.0.0.1'] }, null, 2));

    const result = await runDistributed(inventoryPath, { timeoutSeconds: 1 });
    assert.equal(result.count, 1);
    assert.equal(result.reports.length, 1);
    assert.equal(result.reports[0].target, '127.0.0.1');
});
