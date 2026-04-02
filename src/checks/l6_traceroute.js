const { runCommand } = require('./common');

async function run(target, context) {
    const timeout = context.timeoutSeconds || 5;
    const result = await runCommand(`command -v traceroute >/dev/null 2>&1 && traceroute -n -w 1 -q 1 -m 6 ${target} || echo TRACEROUTE_UNAVAILABLE`, timeout * 1000 + 2000);
    const output = `${result.stdout}\n${result.stderr}`;
    const unavailable = output.includes('TRACEROUTE_UNAVAILABLE');
    const hops = output.split('\n').filter((line) => /^\s*\d+\s+/.test(line));

    return {
        level: 'L6',
        name: 'traceroute',
        ok: !unavailable,
        details: unavailable ? 'Traceroute not available' : `Traceroute executed with ${hops.length} hops`,
        meta: { hops: hops.length }
    };
}

module.exports = { run };
