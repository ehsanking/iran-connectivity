const { runCommand } = require('./common');

async function run(target, context) {
    const timeout = context.timeoutSeconds || 5;
    const result = await runCommand(`command -v whois >/dev/null 2>&1 && whois -h whois.cymru.com " -v ${target}" || echo BGP_UNAVAILABLE`, timeout * 1000 + 2000);
    const output = `${result.stdout}\n${result.stderr}`;
    const unavailable = output.includes('BGP_UNAVAILABLE');
    const line = output.split('\n').map((l) => l.trim()).find((l) => /^\d+\s*\|/.test(l));

    return {
        level: 'L7',
        name: 'bgp-whois',
        ok: !unavailable,
        details: unavailable ? 'BGP whois unavailable' : (line || 'BGP lookup executed'),
        meta: { dataLine: line || null }
    };
}

module.exports = { run };
