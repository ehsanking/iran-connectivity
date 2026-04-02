const { resolveDns } = require('./common');

async function run(target) {
    const result = await resolveDns(target);
    return {
        level: 'L2',
        name: 'dns-resolve',
        ok: result.ok,
        details: result.ok ? `Resolved to ${result.address}` : result.error,
        meta: result
    };
}

module.exports = { run };
