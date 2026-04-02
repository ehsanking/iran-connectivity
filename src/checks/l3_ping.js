const { isValidIPv4, runCommand } = require('./common');

function normalizeTimeoutSeconds(value, fallback = 5) {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.min(parsed, 60);
}

async function run(target, context = {}) {
    if (!isValidIPv4(target)) {
        return {
            level: 'L3',
            name: 'icmp-ping',
            ok: false,
            details: 'Target is not a valid IPv4 address',
            meta: { commandOk: false, commandSkipped: true }
        };
    }

    const timeout = normalizeTimeoutSeconds(context.timeoutSeconds);
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

module.exports = { run, normalizeTimeoutSeconds };
