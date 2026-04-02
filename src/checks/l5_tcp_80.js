const { checkTcpPort } = require('./common');

async function run(target, context) {
    const timeoutMs = (context.timeoutSeconds || 5) * 1000;
    const result = await checkTcpPort(target, 80, timeoutMs);

    return {
        level: 'L5',
        name: 'tcp-80',
        port: 80,
        protocol: 'tcp',
        ok: result.ok,
        details: result.ok ? 'TCP/80 is reachable' : `TCP/80 failed: ${result.error || 'unknown'}`
    };
}

module.exports = { run };
