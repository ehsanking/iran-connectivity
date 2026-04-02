const fs = require('fs');
const path = require('path');
const { runPipeline } = require('./pipeline');

function loadInventory(filePath) {
    const absolutePath = path.resolve(filePath);
    const payload = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    if (!Array.isArray(payload.targets)) {
        throw new Error('Inventory must include a targets array');
    }
    return payload;
}

async function runDistributed(inventoryPath, options = {}) {
    const inventory = loadInventory(inventoryPath);
    const reports = [];

    for (const target of inventory.targets) {
        const report = await runPipeline(target, {
            timeoutSeconds: options.timeoutSeconds,
            extra: { controller: { inventory: inventoryPath } }
        });
        reports.push(report);
    }

    return {
        generatedAt: new Date().toISOString(),
        inventory: inventoryPath,
        count: reports.length,
        reports
    };
}

module.exports = {
    runDistributed
};
