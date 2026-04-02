const { checkTcpPort } = require('./common');

async function run(target, context) {
    const timeoutMs = (context.timeoutSeconds || 5) * 1000;
    const result = await checkTcpPort(target, 443, timeoutMs);

    return {
        level: 'L4',
        name: 'tcp-443',
        port: 443,
        protocol: 'tcp',
        ok: result.ok,
        details: result.ok ? 'TCP/443 is reachable' : `TCP/443 failed: ${result.error || 'unknown'}`
    };
}

module.exports = { run };
