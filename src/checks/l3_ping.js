const { runCommand } = require('./common');

async function run(target, context) {
    const timeout = context.timeoutSeconds || 5;
    const result = await runCommand(`ping -c 1 -W ${timeout} ${target}`, timeout * 1000 + 1000);
    const output = `${result.stdout}\n${result.stderr}`.toLowerCase();
    const ok = result.ok && (output.includes('1 received') || output.includes('0% packet loss'));

    return {
        level: 'L3',
        name: 'icmp-ping',
        ok,
        details: ok ? 'Ping succeeded' : (result.error || 'Ping failed'),
        meta: { commandOk: result.ok }
    };
}

module.exports = { run };
